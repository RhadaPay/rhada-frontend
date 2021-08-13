<template>
  <section>
    <base-card>
      <base-form :formData="formData" :key="formData.fields.length" />
    </base-card>
    <base-card>
      <div class="d-flex justify-space-between">
        <div>
          <v-card-title>Check the List of Past Events Below</v-card-title>
          <v-card-subtitle
            >It may take a few seconds for a new event to be
            processed</v-card-subtitle
          >
        </div>
        <v-card-actions>
          <v-btn dark icon class="accent" @click="refresh()">
            <v-icon v-if="!loading">mdi-refresh</v-icon>
            <v-progress-circular v-else indeterminate />
          </v-btn>
        </v-card-actions>
      </div>
      <v-virtual-scroll :items="items" height="300" item-height="64">
        <template v-slot:default="{ item }">
          <v-list-item :key="item.id">
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
import { FormData, FormField } from "@/models/form";
import { paymentFactory } from "@/plugins/ethers";
import { MissingFieldValueError } from "@/errors";
import Vue from "vue";

const required = true;

interface Event {
  id: number;
  events: number;
  descriptor: string;
}

export default Vue.extend({
  components: {
    BaseForm,
    BaseCard,
  },
  data: () => ({
    loading: false,
    items: [] as Event[],
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
  methods: {
    async refresh(): Promise<void> {
      this.loading = true;
      const eventStreams = await paymentFactory.getEventStreams();
      this.items = eventStreams.map((stream, id) => {
        return {
          id,
          descriptor: stream.descriptor,
          events: Math.floor(Math.random() * 1_000_000),
        };
      });
      this.loading = false;
    },
    async onSubmit(data: FormField[]): Promise<void> {
      const field = data[0];
      if (field.value) {
        await paymentFactory.createEventStream(String(field.value));
      } else {
        throw new MissingFieldValueError(field.name);
      }
      this.refresh();
    },
  },
  async mounted() {
    this.formData.onSubmit = this.onSubmit;
    await this.refresh();
  },
});
</script>
