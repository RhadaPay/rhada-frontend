import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);
import Home from "@/views/Home.vue";

const routes: Array<RouteConfig> = [
  { name: "Home", path: "/", component: Home },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
