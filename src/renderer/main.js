import Vue from 'vue';
import axios from 'axios';
import BootstrapVue from 'bootstrap-vue';
import UUID from 'vue-uuid';
import VueLodash from 'vue-lodash';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import App from './App';
import router from './router';
import store from './store';

const options = {
  name: 'lodash',
};

Vue.use(UUID);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(VueLodash, options);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
