<template>
  <div class="container">
    <ul>
      <li v-for="task in tasks" :key="task.id">
        {{ task.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

/*
  vuetify rewrite:
  use v-container, v-card, and v-list (v-list-item)
*/
export default Vue.extend({
  data: () => ({
    tasks: [
      {
        id: 1,
        name: "Hook up to ethers and fetch the current outstanding job applications",
      },
      { id: 2, name: "Show them as items in the Apply for job datatable" },
      {
        id: 3,
        name: "Change the icon on the datatable to something meaningful",
      },
      { id: 4, name: "Make sure a popup opens, when someone confirms a job" },
      { id: 5, name: "Have the job signed when confirm is clicked" },
    ],
  }),
});
</script>

<style scoped>
.container {
  border: 1px red solid;
}
</style>
