<template>
  <base-card>
    <base-form :formData="formData" :key="formData.fields.length" />
  </base-card>
</template>
<script lang="ts">
import BaseCard from "@/components/BaseCard.vue";
import BaseForm from "@/components/forms/BaseForm.vue";
import { FormData } from "@/models/form";
import { ethers } from "ethers";
// import { PaymentFactory, PaymentFactory__factory } from '../../Rhadatypechain'
import Vue from "vue";

const required = true;
const integer = true;

const abi = [];

const provider = ethers.getDefaultProvider('mumbai');

const contractAddress = "0xd6a21d46beD2E7A36Cb6Fbe22b251a367c144395";

let factory = new ethers.Contract(contractAddress, abi, provider);


export default Vue.extend({
  components: {
    BaseForm,
    BaseCard,
  },
  data: () => ({
    formData: {
      title: "Create A New Job",
      style: "flat",
      submitText: "Next",
      fields: [
        {
          order: 0,
          name: "_description",
          input: "text",
          longName: "Job Name",
          label: "Describe The Job",
          rules: {
            required,
          },
        },
        {
          order: 1,
          name: "_initAmount",
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
          name: "_refreshRate",
          input: "text",
          longName: "Number of Events",
          label: "Target Number of Events before payment increases",
          rules: {
            required,
            integer,
          },
        },
        {
          order: 3,
          name: "_eventStreamId",
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
          items: [
            {
              text: "Rhada DApp Downloads",
              value: 0,
            },
            {
              text: "Email Leads at contact@rhada.co",
              value: 1,
            },
            {
              text: "Tweets From Vitalik Buterin",
              value: 2,
            },
          ],
        },
        {
          order: 4,
          name: "_deadline",
          input: "date",
          longName: "Deadline",
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
          order: 5,
          name: "_percentage",
          input: "text",
          longName: "Payment Per Event",
          label: "% Per Event",
          rules: {
            required,
            integer,
          },
        },
      ],
    } as FormData,
  }),
  methods: {
    myClickEvent: factory.createJob(
      FormData._description, 
      FormData._refreshRate, 
      FormData._eventStreamId, 
      FormData._deadline,
      FormData._percentage
      )}
});
</script>
