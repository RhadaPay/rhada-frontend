/* eslint-disable */
<template>
  <section>
    <base-card>
    <v-card-title class="justify-center"> Download an app </v-card-title>
      <div style="margin-bottom: 3%; text-align: center;">
        <v-container>
          <v-row>
            <v-col>
              <h1 color="primary"> Download <!-- {{ item.descriptor }} --> </h1>
            </v-col>
            <v-col cols="6">
              <v-btn medium  color="primary" @click="download()">
                Download
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </base-card>
    <base-card>
      <div class="d-flex justify-space-between">
        <div>
          <v-card-title>Check the List of Apps Below</v-card-title>
          <v-card-subtitle
            >Click the button on the left to choose which app to download</v-card-subtitle
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
              <v-btn fab small depressed color="primary" @click="loadStream(item)">
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
// import BaseForm from "@/components/forms/BaseForm.vue";
// import { FormData, FormField } from "@/models/form";
import { paymentFactory } from "@/plugins/ethers";
// import { MissingFieldValueError } from "@/errors";
import Vue from "vue";

const required = true;

interface Event {
  id: number;
  events: number;
  descriptor: string;
}

interface item {
  id: number,
  descriptor: string,
  events: any
}

export default Vue.extend({
  components: {
    // BaseForm,
    BaseCard,
  },
  data: () => ({
    loading: false,
    items: [] as Event[],
    // formData: {
    //   title: "Create A New Event Stream",
    //   style: "flat",
    //   submitText: "Create",
    //   fields: [
    //     {
    //       order: 0,
    //       name: "_description",
    //       input: "text",
    //       longName: "Stream Name",
    //       label: "Describe The Stream",
    //       rules: {
    //         required,
    //       },
    //     },
    //   ],
    // } as FormData,
    item: ''
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
    download(): void {
      console.log("Take me to the apply for job screen");
      // this.$router.push({ name: "ApplyComplete" });
      
    },
    loadStream(item: any): void { 
      console.log("Button clicked", item );
    },
    // async onSubmit(): Promise<void> {
    //   // const field = data[0];
    //   // if (field.value) {
    //   //   await paymentFactory.createEventStream(String(field.value));
    //   // } else {
    //   //   throw new MissingFieldValueError(field.name);
    //   // }
    //   this.refresh();
    // },
  },
  async mounted() {
    // this.formData.onSubmit = this.onSubmit;
    await this.refresh();
  },
});
</script>
