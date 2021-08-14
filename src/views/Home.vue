<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Rhada Events Dashboard</v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-card class="widget">
          <v-card-title>Apply for Jobs</v-card-title>
          <v-card-subtitle>List some jobs to Apply For</v-card-subtitle>
          <v-card-actions>
            <v-btn class="primary" @click="$router.push({ name: 'Apply' })"
              >Apply</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-card-title>Create A Stream</v-card-title>
          <v-card-subtitle
            >Define a new event stream to hook up your jobs to</v-card-subtitle
          >
          <v-card-actions>
            <v-btn
              class="primary"
              @click="$router.push({ name: 'CreateStream' })"
              >Create</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-card-title>Create a Job</v-card-title>
          <v-card-subtitle
            >Submit a new job that you need help with</v-card-subtitle
          >
          <v-card-actions>
            <v-btn class="primary" @click="$router.push({ name: 'CreateJob' })"
              >Create</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-card>
          <div class="d-flex justify-space-between">
            <v-card-title>Event Stream - Monthly</v-card-title>
            <v-card-actions>
              <v-btn class="primary" @click="fillData()">Refresh</v-btn>
            </v-card-actions>
          </div>
          <div v-if="!loading">
            <bar-chart
              :chart-data="dataCollectionBar"
              :options="barOptions"
            ></bar-chart>
          </div>
          <div
            style="min-height: 300px"
            v-else
            class="d-flex align-center justify-center"
          >
            <v-progress-circular primary large indeterminate />
          </div>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <div class="d-flex justify-space-between">
            <v-card-title>Superfluid Payment Flows</v-card-title>
            <v-card-actions>
              <v-btn class="primary" to="/payments">Payments</v-btn>
            </v-card-actions>
          </div>
          <div v-if="!loading">
            <line-chart
              :chart-data="datacollection"
              :options="{ responsive: true, maintainAspectRatio: false }"
            ></line-chart>
          </div>
          <div
            style="min-height: 300px"
            v-else
            class="d-flex align-center justify-center"
          >
            <v-progress-circular primary large indeterminate />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";

// @ts-ignore-next-line
import { LineChart, BarChart } from "@/plugins/chart";
import { VuetifyThemeVariant } from "vuetify/types/services/theme";
import axios from "axios";
import { paymentFactory } from "@/plugins/ethers";

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const data = (): number[] => labels.map((_) => Math.floor(Math.random() * 100));

export default Vue.extend({
  components: {
    LineChart,
    BarChart,
  },
  data: () => ({
    loading: true,
    datacollection: null as any,
    dataCollectionBar: null as any,
    eventStreams: [] as string[],
    streamCount: [] as number[],
    barOptions: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: { mirror: true, z: 1 },
          },
        ],
      },
    },
  }),
  async mounted() {
    this.loading = true;
    await this.getStreamCount();
    this.fillData();
    if (this.streamCount.length === 0) {
      // triggers a chart refresh with new data
      setTimeout(() => this.fillData(), 1500);
    }
    this.loading = false;
  },
  computed: {
    color(): Partial<VuetifyThemeVariant> {
      return this.$vuetify.theme.currentTheme;
    },
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels,
        datasets: [
          {
            label: "Events Recorded",
            backgroundColor: this.color.accent,
            data: data(),
          },
        ],
      };
      this.dataCollectionBar = {
        labels: this.eventStreams,
        datasets: [
          {
            label: "Events Recorded",
            data: this.streamCount,
            backgroundColor: this.color.accent,
          },
        ],
      };
    },
    async getStreamCount(): Promise<void> {
      this.eventStreams = [];
      this.streamCount = [];
      const streams = await paymentFactory.getEventStreams();
      await new Promise<void>((resolve) => {
        streams.forEach((stream, id) => {
          axios
            .get(`http://localhost:3000/events?eventStreamId=${id}`)
            .then((response) => {
              this.eventStreams.push(stream.descriptor);
              this.streamCount.push(response.data.data.length);
            });
        });
        resolve();
      });
    },
  },
});
</script>
