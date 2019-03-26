<template>
  <div id="main-table" class="mb-1 mt-1">
    <!-- <b-button @click="toggleBusy">Toggle Busy State</b-button> -->
    <!-- <div class="container">
      <div class="d-flex flex-row">
        <b-button-group size="lg" class="m-2">
          <b-button
          id="testButton"
            v-b-tooltip.hover
            title="Добавить колонку в таблицу"
            variant="success"
            v-b-modal.addColModal
          >Добавить колонку</b-button>
          <b-button
            v-b-tooltip.hover
            title="Добавить строку в таблицу"
            variant="success"
            v-b-modal.addRowModal
          >Добавить строку</b-button>
        </b-button-group>
      </div>
    </div>-->
    <b-table
      :busy="isBusy"
      striped
      fixed
      id="mainTable"
      selectable
      selectedVariant="success"
      hover
      bordered
      :items="items"
      :fields="fields"
      select-mode="single"
      @row-selected="rowSelected"
      @row-clicked="rowClickHandler"
    >
      <!-- <template slot="col0" slot-scope="data">
        <b-button
          size="sm"
          :id="`button${data.value}`"
          :key="data.value"
          variant="outline-secondary"
        >{{data.value}}</b-button>
      </template> -->

      <template slot="col1" slot-scope="data">
        <div :id="`pop${data.index}`">{{data.value.value }}</div>
        <b-popover
          :id="`idPop${data.index}`"
          :key="`col1id${data.index}`"
          :target="`pop${data.index}`"
          placement="top"
          title="head.colHelp"
        />
      </template>
      <template v-for="head in headers" :slot="head.nameHead">
        <b-button
          size="sm"
          :id="`button${head.nameHead}`"
          :key="head.nameHead"
          variant="outline-secondary"
        >
          <b>{{ head.label }}</b>
        </b-button>
        <b-popover
          v-if="head.label != headers[0].label"
          :key="`popover${head.nameHead}`"
          :target="`button${head.nameHead}`"
          placement="top"
          :title="head.colHelp"
          triggers="hover focus"
        >
          <div class="d-flex flex-column">
            <b-button class="mb-1" @click="deleteCol(head.label)" variant="danger">Удалить</b-button>
            <b-button
              class="mt-1"
              @click="showModalEdit(head.label, head.colHelp)"
              variant="success"
            >Редактировать</b-button>
          </div>
        </b-popover>
      </template>
      <div slot="table-busy" class="text-center text-danger my-2">
        <b-spinner class="align-middle"/>
        <strong>Данные загружаются...</strong>
      </div>
    </b-table>

    <b-modal
      key="modalEdit"
      v-model="showModalEditCol"
      id="editColModal"
      title="Редактирование колонки"
      header-bg-variant="dark"
      header-text-variant="light"
    >
      <b-form>
        <b-form-group
          id="editColInputGroup"
          label="Название колонки:"
          label-for="labelColInput"
          description="Название колонки будет отображаться в таблице"
        >
          <b-form-input
            id="editLabelColInput"
            type="text"
            v-model="newLabel"
            required
            placeholder="Допускаются любые символы"
          />
        </b-form-group>
      </b-form>
      <b-form>
        <b-form-group id="editHelpInputGroup" label="Описание колонки:" label-for="helpColInput">
          <b-form-input
            id="helpColInput"
            type="text"
            v-model="newHelp"
            required
            placeholder="Допускаются любые символы"
          />
        </b-form-group>
      </b-form>
      <template slot="modal-footer">
        <b-button @click="resetEditCol" type="reset" variant="danger">Сбросить</b-button>
        <b-button @click="editCol" variant="primary">Сохранить</b-button>
      </template>
    </b-modal>

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
          description="Имя строки отображается в первой колонке"
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
         <b-form-group
          id="nameRowInputGroup"
          label="Дополнительные директории:"
          label-for="nameRowInput"
          description="Будет отображается в последней колонке"
        >
          <b-form-input
            class="mt-1 mb-1"
            v-for="(add, index) in newRow.addPath"
            :key="index"
            :id='$uuid.v4()'
            type="text"
            v-model.lazy="add.name"
            required
            @change="changeAddPath"
            placeholder="Допускаются любые символы"
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
      showModalEditCol: false,
      isBusy: true,

      currentLabel: '',
      currentHelp: '',
      newLabel: '',
      newHelp: '',

      newCol: {
        label: '',
        colHelp: '',
      },
      newRow: {
        name: '',
        path: '',
        addPath: [{
          name: '',
        }],
      },


      fields: [],
      items: [],
      headers: [],
      selected: null,
    };
  },
  mounted() {
    this.getData();
    this.setListenAddCol();
    this.setListenAddRow();
    this.setListenData();
    this.setListenStatus();
  },
  methods: {
    setListenData() {
      const vm = this;
      this.$electron.ipcRenderer.on('data', (event, arg) => {
        this.headers = arg.headers;
        this.fields = [];
        this.headers.forEach((head, index) => {
          vm.fields.push(`col${index}`);
          head.nameHead = `HEAD_col${index}`;
        });
        this.items = [];

        this.items = JSON.parse(JSON.stringify(arg.items));
        // this.items = this._.cloneDeep(arg.items);
        this.items.forEach((item, index) => {
          const newItem = {
            value: item.col1,
            index,
          };
          item.col1 = newItem;
        });
      });
    },
    rowClickHandler(record, index) {
      console.log(record);
      console.log(index);
      if (this.selected[0]) {
        this.$root.$emit('bv::hide::popover');
        this.$root.$emit('bv::show::popover', `pop${index}`);
      } else {
        console.log('unselected');
        this.$root.$emit('bv::hide::popover');
      }
    },
    setListenAddCol() {
      this.$electron.ipcRenderer.on('callAddColModal', () => {
        this.showModalAddCol = !this.showModalAddCol;
      });
    },
    setListenAddRow() {
      this.$electron.ipcRenderer.on('callAddRowModal', () => {
        this.showModalAddRow = !this.showModalAddRow;
      });
    },
    setListenStatus() {
      this.$electron.ipcRenderer.on('status', (event, arg) => {
        if (arg === 200) {
          this.getData();
        }
      });
    },
    showModalEdit(label, colHelp) {
      this.newHelp = colHelp;
      this.newLabel = label;
      this.currentLabel = label;
      this.currentHelp = colHelp;
      this.showModalEditCol = !this.showModalEditCol;
    },
    rowSelected(items) {
      this.selected = items;
    },
    editCol() {
      this.$electron.ipcRenderer.send('editCol', {
        label: this.currentLabel,
        newLabel: this.newLabel,
        newHelp: this.newHelp,
      });
      this.resetEditCol();
    },
    resetEditCol() {
      this.showModalEditCol = !this.showModalEditCol;
      this.newLabel = '';
      this.newHelp = '';
    },
    deleteCol(label) {
      this.$electron.ipcRenderer.send('delCol', label);
    },
    addRow() {
      /* this.newRow.addPath.forEach((path, index, arr) => {
        path = path.name;
        if (index === arr.length - 1) {
          arr.splice(index, 1);
        }
      }); */
      this.$electron.ipcRenderer.send('newRow', this.newRow);
      this.showModalAddRow = !this.showModalAddRow;
    },
    addCol() {
      this.$electron.ipcRenderer.send('newCol', this.newCol);
      this.showModalAddCol = !this.showModalAddCol;
    },
    resetAddCol() {
      this.newCol = {
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
      console.log('getData');
      this.isBusy = true;
      this.$electron.ipcRenderer.send('get-data');
      this.isBusy = false;
    },
    changeAddPath() {
      console.log('changhe');
      if (this.newRow.addPath[this.newRow.addPath.length - 1].name !== '') {
        this.newRow.addPath.push({
          name: '',
        });
      }
      this.newRow.addPath.forEach((row, index, arr) => {
        if ((row.name === '') && (arr.length - 1 !== index)) {
          arr.splice(index, 1);
        }
      });
    },
  },
};
</script>
