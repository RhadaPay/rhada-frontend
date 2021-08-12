<template>
  <base-card>
    <base-form :formData="formData" :key="formData.fields.length" />
  </base-card>
</template>
<script lang="ts">
import BaseCard from "@/components/BaseCard.vue";
import BaseForm from "@/components/forms/BaseForm.vue";
import { FormData } from "@/models/form";
import Vue from "vue";

const required = true;
const integer = true;

export default Vue.extend({
  components: {
    BaseForm,
    BaseCard,
  },
  data: () => ({
    formData: {
      title: "Create A New Event Stream",
      style: "flat",
      submitText: "Create",
      fields: [
        {
          order: 0,
          name: "_description",
          input: "text",
          longName: "Stream Name",
          label: "Describe The Stream",
          rules: {
            required,
          },
        },
      ],
    } as FormData,
  }),
});
</script>
