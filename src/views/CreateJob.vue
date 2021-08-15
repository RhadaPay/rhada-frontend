<template>
  <base-card>
    <v-progress-linear v-if="loading" indeterminate />
    <base-form :formData="formData" :key="formData.fields.length" />
    <v-progress-linear v-if="loading" indeterminate />
  </base-card>
</template>
<script lang="ts">
import BaseCard from "@/components/BaseCard.vue";
import BaseForm from "@/components/forms/BaseForm.vue";
import { MissingFieldValueError } from "@/errors";
import { FormData, FormField, Item } from "@/models/form";
import { paymentFactory } from "@/plugins/ethers";
import { BigNumber } from "@ethersproject/bignumber";
import Vue from "vue";

const required = true;
const integer = true;

const errorHandle = (field: FormField, callback: CallableFunction) => {
  if (field.value) {
    return callback(field);
  } else {
    console.log(field);
    throw new MissingFieldValueError(field.name);
  }
};

interface FormFieldWithValue extends FormField {
  value: string | number | boolean;
}

export default Vue.extend({
  components: {
    BaseForm,
    BaseCard,
  },
  methods: {
    text(field: FormFieldWithValue): string {
      return errorHandle(field, () => field.value.toString());
    },
    bigNum(field: FormFieldWithValue): BigNumber {
      return errorHandle(field, () => BigNumber.from(field.value));
    },
    unixDatestamp(field: FormField): number {
      if (field.dateMeta?.date) {
        return Date.parse(field.dateMeta.date.replaceAll("-", " "));
      } else {
        throw new MissingFieldValueError(field.name);
      }
    },
    getField(name: string, data: FormField[]): FormFieldWithValue {
      return data.filter(
        (field) => field.name === name
      )[0] as FormFieldWithValue;
    },
    async onSubmit(formData: FormField[]) {
      this.loading = true;
      const initAmount = this.getField("initAmount", formData);
      const descriptor = this.getField("descriptor", formData);
      const refreshRate = this.getField("refreshRate", formData);
      const eventStreamId = this.getField("eventStreamId", formData);
      const deadline = this.getField("deadline", formData);
      const percentage = this.getField("percentage", formData);

      await paymentFactory.createJob(
        this.bigNum(initAmount),
        this.text(descriptor),
        this.bigNum(refreshRate),
        this.bigNum(eventStreamId),
        this.unixDatestamp(deadline),
        this.bigNum(percentage)
      );
      this.loading = false;
    },

    async getEventStreams(): Promise<Item[]> {
      const streams = await paymentFactory.getEventStreams();
      return streams.map((stream, id) => ({
        text: stream.descriptor,
        value: id,
      }));
    },
  },
  async mounted() {
    this.formData.onSubmit = this.onSubmit;
    this.loading = true;
    this.getField("eventStreamId", this.formData.fields).items =
      await this.getEventStreams();
    this.loading = false;
  },
  data: () => ({
    loading: false,
    formData: {
      title: "Create A New Job",
      style: "flat",
      submitText: "Next",
      fields: [
        {
          order: 0,
          name: "descriptor",
          input: "text",
          longName: "Job Name",
          label: "Describe The Job",
          rules: {
            required,
          },
        },
        {
          order: 1,
          name: "initAmount",
          input: "text",
          longName: "Downpayment",
          label: "How Much Is Required Up Front",
          rules: {
            required,
            integer,
          },
        },
        {
          order: 2,
          name: "eventStreamId",
          input: "dropdown",
          longName: "Events",
          label: "Select From a List of Available Events to Connect To",
          rules: {
            required,
          },
          default: {
            text: "",
            value: "",
          },
          items: [],
        },
        {
          order: 3,
          name: "refreshRate",
          input: "text",
          longName: "Target",
          label: "Target Number of Events before payment increases",
          rules: {
            required,
            integer,
          },
        },
        {
          order: 4,
          name: "percentage",
          input: "text",
          longName: "% Increase",
          label: "% Increase At Each Event Target",
          rules: {
            required,
            integer,
          },
        },        
        {
          order: 5,
          name: "deadline",
          input: "date",
          longName: "Deadline",
          value: "",
          rules: {
            required: true,
            disabled: false,
          },
          dateMeta: {
            menu: false,
            date: new Date().toISOString().substr(0, 10),
            ref: "deadline",
          },
          default: new Date().toISOString().substr(0, 10),
        },
        {
          order: 6,
          name: "maxAllowedFlow",
          input: "text",
          longName: "Total Contract Value",
          label: "Maximum Amount for the contract",
          rules: {
            required,
            integer,
          },
        },        
      ],
    } as FormData,
  }),
});
</script>
