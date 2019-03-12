<template>
  <div id="main-table">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
    <b-table striped hover :items="items" :fields="fields">
      <template slot="HEAD_first_name" slot-scope="data">
        <a v-b-tooltip="'ToolTip!'">{{ data.label }}</a>
      </template>
      <template slot="first_name" slot-scope="data">{{ data.value }}</template>
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
    };
  },
  mounted() {
    this.getFields();
  },
  methods: {
    getFields() {
      const vm = this;
      this.$electron.ipcRenderer.send('get-data');
      this.$electron.ipcRenderer.on('data', (event, arg) => {
        arg.headers.forEach((head) => {
          vm.fields.push(head.name);
        });
        this.items = arg.items;
        console.log(this.fields);
        console.log(arg); // prints "pong"
      });
    },
  },
};
</script>