import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);
import Home from "@/views/Home.vue";
import MonitorProgress from "@/views/MonitorProgress.vue";
import CreateJob from "@/views/CreateJob.vue";
import CreateStream from "@/views/CreateStream.vue";
import Apply from "@/views/Apply.vue";

const routes: Array<RouteConfig> = [
  { name: "Home", path: "/", component: Home },
  { name: "Apply", path: "/jobs/apply", component: Apply },
  { name: "CreateJob", path: "/jobs/create", component: CreateJob },
  { name: "CreateStream", path: "/event-streams/create", component: CreateStream },
  { name: "Monitor", path: "/monitor", component: MonitorProgress },
  { name: "Not Found Redirect", path: "/:notFound(.*)", component: Home },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
