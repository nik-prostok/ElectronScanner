import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-table',
      component: require('@/components/MainTable').default,
    },
    {
      path: '/help',
      name: 'help',
      component: require('@/components/Help').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
