import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import HomeView from "../views/HomeView.vue";
import store from "@/store";

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
    meta: { adminRole: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
