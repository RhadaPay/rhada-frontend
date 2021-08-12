<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Panel 1</v-card-title>
          <v-card-subtitle>// Summary Stats</v-card-subtitle>
          <v-card-actions>
            <v-btn @click="$router.push({ name: 'Create' })">Create</v-btn>
            <v-btn @click="$router.push({ name: 'Monitor' })">Monitor</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>Create New Job</v-card-title>
          <v-card-subtitle>Rhada Pay, some overview goes here</v-card-subtitle>
          <v-card-actions>
            <v-btn @click="$router.push({ name: 'Create' })">Create</v-btn>
            <v-btn @click="$router.push({ name: 'Monitor' })">Monitor</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Existing Jobs</v-card-title>
          <v-card-subtitle>Rhada Pay, some overview goes here</v-card-subtitle>
          <v-card-actions>
            <v-btn @click="$router.push({ name: 'Create' })">Create</v-btn>
            <v-btn @click="$router.push({ name: 'Monitor' })">Monitor</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>A Graph</v-card-title>
          <div class="small">
            <line-chart :chartData="datacollection"></line-chart>
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
<style scoped>
.v-card {
  max-width: 500px;
  min-width: 260px;
  min-height: 50%;
}
</style>
