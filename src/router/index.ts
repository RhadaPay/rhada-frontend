import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);
import Home from "@/views/Home.vue";
import MonitorProgress from "@/views/MonitorProgress.vue";
import CreateJob from "@/views/CreateJob.vue";
import Payments from "@/views/Payments.vue";

const routes: Array<RouteConfig> = [
  { name: "Home", path: "/", component: Home },
  { name: "Create", path: "/new", component: CreateJob },
  { name: "Monitor", path: "/monitor", component: MonitorProgress },
  {name: "Payments", path: "/payments", component: Payments },
  { name: "Not Found Redirect", path: "/:notFound(.*)", component: Home },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
