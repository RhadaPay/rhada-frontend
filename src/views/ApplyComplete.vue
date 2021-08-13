<template>
  <base-card>
    <v-card-title>Confirm You Want to Apply to this Job?</v-card-title>
    <v-card-actions class="d-flex flex-column align-start">
      <v-checkbox
        label="I think we automate a lot of the back and forth if we can here, it's going to be an absolute pain to program otherwise"
      ></v-checkbox>
      <v-btn class="primary">Confirm</v-btn>
    </v-card-actions>
  </base-card>
</template>
<script lang="ts">
import BaseCard from "@/components/BaseCard.vue";
import Vue from "vue";
export default Vue.extend({
  components: {
    BaseCard,
  },
});
</script>
