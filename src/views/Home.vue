<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card><v-card-title>Rhada Events Dashboard</v-card-title></v-card>
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
          <v-card-title>Event Stream - Monthly</v-card-title>
          <div>
            <line-chart
              :chartData="datacollection"
              :options="{ responsive: true, maintainAspectRatio: false }"
            ></line-chart>
            <button @click="fillData()">Randomize</button>
          </div>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-card-title>Superfluid Payment Flows</v-card-title>
          <div>
            <line-chart
              :chartData="datacollection"
              :options="{ responsive: true, maintainAspectRatio: false }"
            ></line-chart>
            <button @click="fillData()">Randomize</button>
          </div>
        </v-card>
      </v-col>      
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";

// @ts-ignore-next-line
import { LineChart } from "@/LineChart";

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
  },
  data: () => ({
    label: "Github Commits",
    options: { responsive: true },
    datacollection: null as any,
  }),
  mounted() {
    this.fillData();
  },
  computed: {
    color(): string {
      const { primary } = this.$vuetify.theme.currentTheme;
      if (primary) {
        return String(primary);
      } else {
        return "grey";
      }
    },
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels,
        datasets: [
          {
            label: "Events Recorded",
            backgroundColor: this.color,
            data: data(),
          },
        ],
      };
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
  },
});
</script>
