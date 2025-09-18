import { createRouter, createWebHashHistory } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import EventManagement from '@/views/EventManagement.vue'
import GradeManagement from '@/views/GradeManagement.vue'
import SystemManagement from '@/views/SystemManagement.vue'
import UserManagement from '@/views/UserManagement.vue'
import Login from '@/components/Login.vue'
const routes = [
  // {
  //   path: '/',
  //   redirect: {name:'Login'}
  // },
  // {
  //   path:'/Login',
  //   name:'Login',
  //   component:Login
  // },
  {
    path:'/',
    redirect: '/SystemManagement'
  },
  {
    path: '/NavigationBar',
    component: NavigationBar,
    children: [
      {
        path: '/SystemManagement',
        name: 'SystemManagement',
        component: SystemManagement
      },
      {
        path: '/GradeManagement',
        name: 'GradeManagement',
        component: GradeManagement
      },
      {
        path: '/UserManagement',
        name: 'UserManagement',
        component: UserManagement
      },
      {
        path: '/EventManagement',
        name: 'EventManagement',
        component: EventManagement
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
