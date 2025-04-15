import { createRouter, createWebHashHistory } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import HomePage from '@/views/HomePage.vue'
import DynamicPage from '@/views/DynamicPage.vue'
import StorePage from '@/views/StorePage.vue'
import OtherPage from '@/views/OtherPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/HomePage'
  },
  {
    path: '/NavigationBar',
    component: NavigationBar,
    children: [
      {
        path: '/HomePage',
        name: 'HomePage',
        component: HomePage
      },
      {
        path: '/DynamicPage',
        name: 'DynamicPage',
        component: DynamicPage
      },
      {
        path: '/StorePage',
        name: 'StorePage',
        component: StorePage
      },
      {
        path: '/OtherPage',
        name: 'OtherPage',
        component: OtherPage
      }
    ]
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
