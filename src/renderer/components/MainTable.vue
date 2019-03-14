<template>
  <div id="main-table">
    <b-table striped hover :items="items" :fields="fields">
      <template v-for="head in headers" :slot="head.nameHead" slot-scope="data">
        <b-button :key="head.nameHead" v-b-tooltip.hover :title="head.colHelp" variant="light"><b>{{ data.label }}</b></b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'main-table',
  data() {
    return {
      fields: [],
      items: [],
      headers: [],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      const vm = this;
      this.$electron.ipcRenderer.send('get-data');
      this.$electron.ipcRenderer.on('data', (event, arg) => {
        arg.headers.forEach((head) => {
          vm.fields.push(head.name);
        });
        this.headers = arg.headers;
        console.log(this.headers);
        this.headers.forEach((head) => {
          head.nameHead = `HEAD_${head.name}`;
        });
        this.items = arg.items;
        console.log(this.headers);
      });
    },
  },
};
</script>