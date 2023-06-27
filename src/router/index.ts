import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../components/VisitorDashboard.vue'),
    },
    {
      path: '/admin',
      component: () => import('../components/AdminDashboard.vue'),
    },
    {
      path: '/forester',
      component: () => import('../components/ForesterDashboard.vue'),
    }
  ],
})
