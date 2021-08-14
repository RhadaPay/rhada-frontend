<template>
  <v-icon>{{ complete ? 'mdi-check' : 'mdi-select' }}</v-icon>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    complete: {
      type: Boolean,
      default: false
    }
  }
})
</script>