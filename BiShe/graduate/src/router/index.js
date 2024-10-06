import Vue, { computed } from 'vue'
import VueRouter from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import Photoalbum from '@/components/Photoalbum.vue'
import AboutMe from '@/components/AboutMe.vue'
import Message from '@/components/Message.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/Photoalbum'
  },
  {
    path: '/HomePage',
    name: 'HomePage',
    component: HomePage,
    children: [
      {
        path: '/Photoalbum',
        name: 'Photoalbum',
        component: Photoalbum
      },
      {
        path: '/AboutMe',
        name: 'AboutMe',
        component: AboutMe
      },
      {
        path: '/Message',
        name: 'Message',
        component: Message
      }
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
