import { createRouter, createWebHashHistory } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import HomePage from '@/views/HomePage.vue'
import Page from '@/views/Page.vue'
const routes = [
  {
    path: '/',
    component: NavigationBar
  },
  {
    path: '/HomePage',
    component: HomePage
  }, {
    path: '/Page',
    component: Page
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
