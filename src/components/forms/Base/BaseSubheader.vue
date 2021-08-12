<template>
  <v-col :sm="subheaderCols" v-if="isSmOrAbove">
    <v-subheader>{{ label }}</v-subheader>
  </v-col>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "BaseSubheader",
  props: {
    label: String,
  },
  data: () => ({
    subheaderCols: 2 as number,
  }),
  computed: {
    isSmOrAbove(): boolean {
      return this.$vuetify.breakpoint.mdAndUp;
    },
  },
});
</script>
