import Vue from "vue";
import VueRouter from "vue-router";
import Navigation from "@/views/Navigation.vue";
import NavOne from "@/views/NavOne.vue";
import Login from "@/views/Login.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    redirect: "/Login",
  },
  {
    path: "/",
    name: "Navigation",
    component: Navigation,
    children: [
      {
        path: "NavOne",
        name: "NavOne",
        component: NavOne,
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
