<template>
  <section>
    <base-card>
      <base-form :formData="formData" :key="formData.fields.length" />
    </base-card>
    <base-card>
      <v-card-title>Check the List of Past Events Below</v-card-title>
      <v-virtual-scroll :items="items" height="300" item-height="64">
        <template v-slot:default="{ item }">
          <v-list-item :key="item">
            <v-list-item-action>
              <v-btn fab small depressed color="primary">
                {{ item.id }}
              </v-btn>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>
                Stream: <strong>{{ item.descriptor }}</strong> | Events:
                <strong>{{ item.events }}</strong>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>
        </template>
      </v-virtual-scroll>
    </base-card>
  </section>
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
    items: [
      { id: 0, events: 100, descriptor: "App Downloads" },
      { id: 1, events: 255, descriptor: "Tweets from Vitalik" },
      { id: 2, events: 34, descriptor: "Email Leads at Our Website" },
      { id: 3, events: 112450, descriptor: "GiB Loaded to IPFS" },
      { id: 4, events: 1_234_566, descriptor: "Transactions on Filecoin" },
    ],
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
