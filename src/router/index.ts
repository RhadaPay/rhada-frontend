import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);
import Home from "@/views/Home.vue";
import MonitorProgress from "@/views/MonitorProgress.vue";
import CreateJob from "@/views/CreateJob.vue";
import Payments from "@/views/Payments.vue";
import CreateStream from "@/views/CreateStream.vue";
import Apply from "@/views/Apply.vue";
import ApplyComplete from "@/views/ApplyComplete.vue";
import TasksForKevin from "@/views/TasksForKevin.vue";

const routes: Array<RouteConfig> = [
  { name: "Home", path: "/", component: Home },
  { name: "Tasks", path: "/tasks", component: TasksForKevin },
  { name: "Apply", path: "/jobs/apply", component: Apply },
  { name: "ApplyComplete", path: "/jobs/confirm", component: ApplyComplete },
  { name: "CreateJob", path: "/jobs/create", component: CreateJob },
  {
    name: "CreateStream",
    path: "/event-streams/create",
    component: CreateStream,
  },
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
