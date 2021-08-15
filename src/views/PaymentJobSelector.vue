<template>
  <v-row>
    <v-col cols="12">
      <base-form :formData="formData" :key="formData.fields.length" />
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { FormData, FormField, Item } from "@/models/form";
import { paymentFactory } from "@/plugins/ethers";
import BaseForm from "@/components/forms/BaseForm.vue";
import Vue from "vue";
export default Vue.extend({
  components: { BaseForm },
  data: () => ({
    formData: {
      title: "Payments Dashboard",
      submitText: "Select Job",
      fields: [
        {
          order: 0,
          label: "Choose A Job",
          name: "jobId",
          longName: "Job",
          input: "dropdown",
          rules: {
            required: true,
          },
          default: {
            text: "Select a job",
            value: -1,
          },
          items: [
            {
              text: "...loading",
              value: -1,
            },
          ],
        },
      ],
    } as FormData,
  }),
  methods: {
    onSubmit(items: FormField[]): void {
      const jobId = items[0].value!.toString();
      this.$router.push({ name: "Payments", params: { jobId } });
    },
    async getJobs(): Promise<void> {
      const getJobs = await paymentFactory.getJobs();
      const jobs: Item[] = [];
      getJobs.forEach((job, id) => {
        jobs.push({
          text: job.descriptor,
          value: id,
        });
      });
      // @ts-ignore-next-line
      this.formData.fields[0].items = jobs;
    },
  },
  async mounted() {
    await this.getJobs();
    this.formData.onSubmit = this.onSubmit;
  },
});
</script>
