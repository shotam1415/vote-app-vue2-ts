import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import HomeView from "../views/HomeView.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/vote",
    name: "vote",
    component: () => import(/* webpackChunkName: "vote" */ "../views/VoteView.vue"),
  },
  {
    path: "/signin",
    name: "signin",
    component: () => import(/* webpackChunkName: "signin" */ "../views/SignInView.vue"),
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import(/* webpackChunkName: "signup" */ "../views/SignUpView.vue"),
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import(/* webpackChunkName: "admin" */ "../views/AdminView.vue"),
  },
  {
    path: "/admin/votetotal",
    name: "adminVotetotal",
    component: () => import(/* webpackChunkName: "adminVotetotal" */ "../views/AdminVotetotalView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
