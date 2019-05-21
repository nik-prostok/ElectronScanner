<template>
  <div id="main-table" class="mb-1 mt-1">
    <b-table
      :busy="isBusy"
      striped
      fixed
      selectable
      selectedVariant="success"
      hover
      bordered
      :items="items"
      :fields="fields"
      select-mode="single"
      @row-selected="rowSelected"
      @row-contextmenu="rowRightClickHandler"
      @row-clicked="rowClickHandler"
    >
      <template slot="addPath" slot-scope="data">
        <div :key="index" v-for="(path, index) in data.item.addPath">
          <p class="small-text" v-if="path.name !== ''">{{path.name}}</p>
        </div>
      </template>
      <template slot="col1" slot-scope="data">
        <div :id="`pop${data.index}`">{{data.value.value }}</div>
        <b-popover
          :id="`idPop${data.index}`"
          :key="`col1id${data.index}`"
          :target="`pop${data.index}`"
          placement="top"
        >
          <b-button class="mt-1" @click="deleteRow(data.index)" variant="danger">Удалить</b-button>
          <b-button class="mt-1" @click="showModalEditR(data.index)" variant="success">Редактировать</b-button>
        </b-popover>
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
          v-if="(head.label != headers[0].label) && (head.nameHead != 'HEAD_colMore')"
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
              @click="showModalEdit(head.label, head.colHelp, head.nameDir)"
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
      v-model="showModalEditRow"
      title="Редактирование строки"
      header-bg-variant="dark"
      header-text-variant="light"
      id="editRowModal"
    >
      <b-form>
        <b-form-group
          id="nameRowInputGroup"
          label="Имя строки:"
          label-for="nameRowInput"
          description="Имя строки отображается в первой колонке"
        >
          <b-form-input
            id="nameRowInput"
            type="text"
            v-model="newTitleRow"
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
          <b-input-group>
            <b-form-input
              id="pathRowInput"
              type="text"
              v-model="newPath"
              required
              placeholder="Введите путь с разделителями '\\'"
            />
            <b-input-group-append>
              <b-button @click="callChooseFile('editRow')" variant="info">Выбрать</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
        <b-form-group
          id="nameRowInputGroup"
          label="Дополнительные директории:"
          label-for="nameRowInput"
          description="Будет отображается в последней колонке"
        >
          <b-form-input
            class="mt-1 mb-1"
            v-for="(add, index) in newAddPath"
            :key="index"
            :id="$uuid.v4()"
            type="text"
            v-model.lazy="add.name"
            required
            @change="changeEditAddPath"
            placeholder="Допускаются любые символы"
          />
        </b-form-group>
      </b-form>
      <template slot="modal-footer">
        <b-button @click="resetEditRow" variant="danger">Сбросить</b-button>
        <b-button @click="editRow" variant="primary">Сохранить</b-button>
      </template>
    </b-modal>

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
        <b-form-group
          id="nameDirColInputGroup"
          label="Название директории:"
          label-for="nameDirColInput"
          description="Название директории"
        >
          <b-form-input
            id="nameDirColInput"
            type="text"
            v-model="newNameDir"
            required
            placeholder="Допускаются любые символы"
          />
        </b-form-group>
      </b-form>
      <template slot="modal-footer">
        <b-button @click="resetEditCol" variant="danger">Сбросить</b-button>
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
      <b-form>
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

        <b-form-group
          id="nameDirColInputGroup"
          label="Название директории:"
          label-for="nameDirColInput"
          description="Название директории"
        >
          <b-input-group>
            <b-form-input
              id="nameDirColInput"
              type="text"
              v-model="newCol.nameDir"
              required
              placeholder="Допускаются любые символы"
            />
          </b-input-group>
        </b-form-group>
      </b-form>
      <template slot="modal-footer">
        <b-button @click="resetAddCol" variant="danger">Сбросить</b-button>
        <b-button @click="addCol" variant="primary">Сохранить</b-button>
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
      <b-form>
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
          <b-input-group>
            <b-form-input
              id="pathRowInput"
              type="text"
              v-model="newRow.path"
              required
            />
            <b-input-group-append>
              <b-button @click="callChooseFile('addRow')" variant="info">Выбрать</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
        <b-form-group
          id="nameRowInputGroup"
          label="Дополнительные директории:"
          label-for="nameRowInput"
          description="Будет отображается в последней колонке"
        >
          <div :key="index" v-for="(add, index) in newRow.addPath">
            <b-form-input
              class="mt-1 mb-1"
              :id="$uuid.v4()"
              type="text"
              v-model.lazy="add.name"
              required
              @change="changeAddPath"
              placeholder="Допускаются любые символы"
            />
          </div>
        </b-form-group>
      </b-form>
      <template slot="modal-footer">
        <b-button @click="resetAddRow" variant="danger">Сбросить</b-button>
        <b-button @click="addRow" variant="primary">Сохранить</b-button>
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
      showModalEditRow: false,
      isBusy: true,

      indexOpenPopover: null,

      currentLabel: '',
      currentHelp: '',
      currentNameDir: '',
      newLabel: '',
      newHelp: '',
      newNameDir: '',

      currentTitleRow: '',
      currentPath: '',
      currentAddPath: [
        {
          name: '',
        },
      ],

      newTitleRow: '',
      newPath: '',
      newAddPath: [
        {
          name: '',
        },
      ],

      newCol: {
        label: '',
        nameDir: '',
        colHelp: '',
      },
      newRow: {
        name: '',
        path: '',
        addPath: [
          {
            name: '',
          },
        ],
      },

      titleEditStand: '',

      fields: [],
      items: [],
      headers: [],
      selected: null,
    };
  },
  created() {
    const vm = this;
    document.addEventListener('click', () => {
      vm.toggleDropdown();
    });
    this.getData();
  },
  mounted() {
    this.setListenData();
    this.setListenAddCol();
    this.setListenAddRow();
    this.setListenCallFileChoose();
    // this.setListenStatus();
  },
  methods: {
    setListenCallFileChoose() {
      this.$electron.ipcRenderer.on('calladdRow', (event, arg) => {
        this.newRow.path = arg;
      });
      this.$electron.ipcRenderer.on('calleditRow', (event, arg) => {
        this.newPath = arg;
      });
    },
    callChooseFile(type) {
      this.$electron.ipcRenderer.send('callChooseFile', type);
    },
    toggleDropdown() {
      this.$root.$emit('bv::hide::popover', `pop${this.indexOpenPopover}`);
    },
    setListenData() {
      this.$electron.ipcRenderer.on('getHelp', () => {
        console.log('getHelp');
        this.$router.push('/help');
      });
      this.$electron.ipcRenderer.on('data', (event, arg) => {
        // this.headers = [];
        this.headers = JSON.parse(JSON.stringify(arg.headers));
        console.log(arg.headers);
        this.fields = [];
        this.headers.forEach((head, index) => {
          this.fields.push({
            key: `col${index}`,
            tdClass: 'text-center',
          });
          head.nameHead = `HEAD_col${index}`;
        });
        this.fields.push('addPath');
        this.headers.push({
          label: 'Доп.',
          nameHead: 'HEAD_addPath',
          colHelp: 'Дополнительно',
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
          item.addPath.push({
            name: '',
          });
        });
      });
    },
    rowRightClickHandler(record, index) {
      console.log(record);
      console.log(index);

      this.indexOpenPopover = index;

      this.titleEditStand = record.col0;
      console.log(record);

      this.currentTitleRow = this.items[index].col0;
      this.currentPath = this.items[index].path;
      this.currentAddPath = [];
      this.currentAddPath = JSON.parse(JSON.stringify(this.items[index].addPath));
      this.currentAddPath = this.currentAddPath.map((path) => {
        const newPath = {
          name: path.name.split(' ')[0],
        };
        return newPath;
      });
      this.$root.$emit('bv::hide::popover');
      this.$root.$emit('bv::show::popover', `pop${index}`);
    },
    rowClickHandler() {
      this.$root.$emit('bv::hide::popover');
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
    showModalEdit(label, colHelp, nameDir) {
      this.newHelp = colHelp;
      this.newLabel = label;
      this.newNameDir = nameDir;
      this.currentLabel = label;
      this.currentHelp = colHelp;
      this.currentNameDir = nameDir;
      this.showModalEditCol = !this.showModalEditCol;
    },
    showModalEditR() {
      this.newTitleRow = this.currentTitleRow;
      this.newPath = this.currentPath;
      this.newAddPath = this.currentAddPath;

      this.showModalEditRow = !this.showModalEditRow;
    },
    rowSelected(items) {
      this.selected = items;
    },
    editCol() {
      this.$electron.ipcRenderer.send('editCol', {
        label: this.currentLabel,
        newLabel: this.newLabel,
        newNameDir: this.newNameDir,
        newHelp: this.newHelp,
      });
      this.resetEditCol();
      this.getData();
    },
    resetEditCol() {
      this.showModalEditCol = !this.showModalEditCol;
      this.newLabel = '';
      this.newNameDir = '';
      this.newHelp = '';
    },
    deleteCol(label) {
      this.$electron.ipcRenderer.send('delCol', label);
      this.getData();
    },
    addRow() {
      this.$electron.ipcRenderer.send('newRow', this.newRow);
      this.showModalAddRow = !this.showModalAddRow;
      this.getData();
    },
    deleteRow(index) {
      this.$electron.ipcRenderer.send('delRow', {
        index,
      });
      this.getData();
    },
    editRow() {
      console.log(this.newTitleRow);
      console.log(this.newPath);
      console.log(this.newAddPath);
      this.newAddPath.forEach((path, index, arr) => {
        if (path.name === '') {
          arr.splice(index, 1);
        }
      });
      console.log(this.newAddPath);
      this.$electron.ipcRenderer.send('editRow', {
        currentTitleRow: this.currentTitleRow,
        newTitleRow: this.newTitleRow,
        newPath: this.newPath,
        newAddPath: this.newAddPath,
      });
      this.showModalEditRow = !this.showModalEditRow;
      this.getData();
    },
    resetEditRow() {
      this.showModalEditRow = !this.showModalEditRow;
      this.newTitleRow = '';
      this.newPath = '';
      this.newAddPath = [];
      console.log('reset');
    },
    addCol() {
      this.$electron.ipcRenderer.send('newCol', this.newCol);
      this.showModalAddCol = !this.showModalAddCol;
      this.getData();
    },
    resetAddCol() {
      this.newCol = {
        label: '',
        nameDir: '',
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
    changeEditAddPath() {
      if (this.currentAddPath[this.currentAddPath.length - 1].name !== '') {
        this.currentAddPath.push({
          name: '',
        });
      }
      this.currentAddPath.forEach((row, index, arr) => {
        if (row.name === '' && arr.length - 1 !== index) {
          arr.splice(index, 1);
        }
      });
    },
    changeAddPath() {
      if (this.newRow.addPath[this.newRow.addPath.length - 1].name !== '') {
        this.newRow.addPath.push({
          name: '',
        });
      }
      this.newRow.addPath.forEach((row, index, arr) => {
        if (row.name === '' && arr.length - 1 !== index) {
          arr.splice(index, 1);
        }
      });
    },
  },
};
</script>

<style scoped>
.small-text {
  font-size: 0.7rem;
  margin-bottom: 6px;
}
</style>
