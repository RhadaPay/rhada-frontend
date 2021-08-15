<template>
  <v-btn
    class="details"
    depressed
    :disabled="disabled"
    icon
    small
    dark
    color="primary"
    @click="onClick"
  >
    <v-icon class="accent--text">{{ complete ? "mdi-check" : "mdi-select" }}</v-icon>
  </v-btn>
</template>
<script lang="ts">
import { TableData } from "@/models/table";
import Vue from "vue";
export default Vue.extend({
  props: {
    complete: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick(item: TableData) {
      this.$emit("click", item);
    },
  },
});
</script>
