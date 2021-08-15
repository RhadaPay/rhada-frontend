import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);
import Home from "@/views/Home.vue";
import CreateJob from "@/views/CreateJob.vue";
import Payments from "@/views/Payments.vue";
import PaymentJobSelector from "@/views/PaymentJobSelector.vue";
import CreateStream from "@/views/CreateStream.vue";
import Apply from "@/views/Apply.vue";
import ApplyComplete from "@/views/ApplyComplete.vue";
import AppStore from "@/views/AppStore.vue";

const routes: Array<RouteConfig> = [
  { name: "Home", path: "/", component: Home },
  { name: "Apply", path: "/jobs/apply", component: Apply },
  { name: "ApplyComplete", path: "/jobs/confirm", component: ApplyComplete },
  { name: "CreateJob", path: "/jobs/create", component: CreateJob },
  { name: "AppStore", path: "/appstore", component: AppStore },
  {
    name: "CreateStream",
    path: "/event-streams/create",
    component: CreateStream,
  },
  { name: "PaymentSelector", path: "/payments", component: PaymentJobSelector },
  { name: "Payments", path: "/payments/:jobId", component: Payments },
  { name: "Not Found Redirect", path: "/:notFound(.*)", component: Home },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
