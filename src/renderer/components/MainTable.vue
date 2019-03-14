<template>
  <div id="main-table" class="mb-1 mt-1">
    <!-- <b-button @click="toggleBusy">Toggle Busy State</b-button> -->
    <b-table
      :busy="isBusy"
      striped
      selectable
      selectedVariant="success"
      hover
      :items="items"
      :fields="fields"
    >
      <template v-for="head in headers" :slot="head.nameHead">
        <b-button :key="head.nameHead" v-b-tooltip.hover :title="head.colHelp" variant="light">
          <b>{{ head.label }}</b>
        </b-button>
      </template>
      <div slot="table-busy" class="text-center text-danger my-2">
        <b-spinner class="align-middle"/>
        <strong>Данные загружаются...</strong>
      </div>
    </b-table>

    <div class="container">
      <div class="d-flex flex-row">
        <b-button
          class="m-1"
          v-b-tooltip.hover
          title="Добавить колонку в таблицу"
          variant="success"
          v-b-modal.addColModal
        >Добавить колонку</b-button>
        <b-button
          class="m-1"
          v-b-tooltip.hover
          title="Добавить строку в таблицу"
          variant="success"
          v-b-modal.addRowModal
        >Добавить строку</b-button>
      </div>
    </div>
    <b-modal
      ref="addColRef"
      v-model="showModalAddCol"
      id="addColModal"
      title="Добавление новой колонки"
      header-bg-variant="dark"
      header-text-variant="light"
    >
      <b-form @submit="addCol" @reset="resetAddCol">
        <b-form-group
          id="nameColInputGroup"
          label="Имя колонки:"
          label-for="nameColInput"
          description="Имя колонки позволяет связать колонку и строку"
        >
          <b-form-input
            id="nameColInput"
            type="text"
            v-model="newCol.name"
            required
            placeholder="Допускаются латинские буквы и цифры"
          />
        </b-form-group>

        <b-form-group
          id="labelColInputGroup"
          label="Название колонки:"
          label-for="labelColInput"
          description="Название колонки будет отображаться в таблице"
        >
          <b-form-input
            id="labelColInput"
            type="text"
            v-model="newCol.label"
            required
            placeholder="Допускаются любые символы"
          />
        </b-form-group>

        <b-form-group
          id="tooltipColInputGroup"
          label="Текст подсказки"
          label-for="tooltipColInput"
          description="Название колонки будет отображаться в таблице"
        >
          <b-form-input
            id="tooltipColInput"
            type="text"
            v-model="newCol.colHelp"
            required
            placeholder="Допускаются любые символы"
          />
        </b-form-group>
      </b-form>
      <template slot="modal-footer">
        <b-button @click="resetAddCol" type="reset" variant="danger">Сбросить</b-button>
        <b-button @click="addCol" type="submit" variant="primary">Сохранить</b-button>
      </template>
    </b-modal>
    <b-modal
      ref="addRowRef"
      v-model="showModalAddRow"
      title="Добавление новой строки"
      header-bg-variant="dark"
      header-text-variant="light"
      id="addRowModal"
    >
      <b-form @submit="addRow" @reset="resetAddRow">
        <b-form-group
          id="nameRowInputGroup"
          label="Имя строки:"
          label-for="nameRowInput"
          description="Имя строки отображается в первой строке"
        >
          <b-form-input
            id="nameRowInput"
            type="text"
            v-model="newRow.name"
            required
            placeholder="Допускаются любые символы"
          />
        </b-form-group>

        <b-form-group
          id="pathRowInputGroup"
          label="Путь к папке:"
          label-for="pathRowInput"
          description="Путь до папки с результатами полета"
        >
          <b-form-input
            id="pathRowInput"
            type="text"
            v-model="newRow.path"
            required
            placeholder="Введите путь с разделителями '\\'"
          />
        </b-form-group>
      </b-form>
      <template slot="modal-footer">
        <b-button @click="resetAddRow" type="reset" variant="danger">Сбросить</b-button>
        <b-button @click="addRow" type="submit" variant="primary">Сохранить</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'main-table',
  data() {
    return {
      showModalAddCol: false,
      showModalAddRow: false,
      newCol: {
        name: '',
        label: '',
        colHelp: '',
      },
      newRow: {
        name: '',
        path: '',
      },
      isBusy: true,
      fields: [],
      items: [],
      headers: [],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    addRow() {
      this.$electron.ipcRenderer.on('status', (event, arg) => {
        console.log(arg);
        if (arg === 200) {
          this.getData();
        }
      });
      this.$electron.ipcRenderer.send('newRow', this.newRow);
      this.showModalAddRow = !this.showModalAddRow;
    },
    addCol() {
      this.$electron.ipcRenderer.on('status', (event, arg) => {
        console.log(arg);
        if (arg === 200) {
          this.getData();
        }
      });
      this.$electron.ipcRenderer.send('newCol', this.newCol);
      this.showModalAddCol = !this.showModalAddCol;
    },
    resetAddCol() {
      this.newCol = {
        name: '',
        lable: '',
        colHelp: '',
      };
      this.showModalAddCol = !this.showModalAddCol;
    },
    resetAddRow() {
      this.newRow = {
        name: '',
        path: '',
      };
      this.showModalAddRow = !this.showModalAddRow;
    },
    toggleBusy() {
      this.isBusy = !this.isBusy;
    },
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
      this.isBusy = false;
    },
  },
};
</script>