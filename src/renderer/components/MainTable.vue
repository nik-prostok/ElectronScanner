<template>
  <div id="main-table">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
    <b-table striped hover :items="items" :fields="fields">
      <template slot="HEAD_first_name" slot-scope="data">
        <a v-b-tooltip="'ToolTip!'">{{ data.label }}</a>
      </template>
      <template slot="first_name" slot-scope="data">{{ data.value }}</template>
    </b-table>
    {{getFields()}}
  </div>
</template>

<script>
export default {
  name: 'main-table',
  data() {
    return {
      fields: [],
      items: [
        {
          isActive: true,
          age: 40,
          first_name: 'Dickerson',
          last_name: 'Macdonald',
        },
        {
          isActive: false,
          age: 21,
          first_name: 'Larsen',
          last_name: 'Shaw',
        },
        {
          isActive: false,
          age: 89,
          first_name: 'Geneva',
          last_name: 'Wilson',
        },
        {
          isActive: true,
          age: 38,
          first_name: 'Jami',
          last_name: 'Carney',
        },
      ],
    };
  },
  mounted: {},
  methods: {
    getFields() {
      const cls = this;
      this.$electron.ipcRenderer.send('get-fields');
      this.$electron.ipcRenderer.on('fields', (event, arg) => {
        cls.fields = arg;
        console.log(arg); // prints "pong"
      });
    },
  },
};
</script>