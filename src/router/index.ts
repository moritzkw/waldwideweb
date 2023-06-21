import { createRouter, createWebHistory } from 'vue-router'
import AppVue from '../App.vue'
import VisitorDashboardVue from '../components/VisitorDashboard.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: VisitorDashboardVue,
    },
    {
      path: '/admin',
      component: () => import('../components/AdminDashboard.vue'),
    },
    {
      path: '/test',
      component: () => import('../components/Test.vue'),
    },
    // {
    //   path: '/forester',
    //   component: () => import('../components/ForesterDashboard.vue'),
    // },
  ],
})
