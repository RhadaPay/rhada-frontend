<template>
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
</template>
<script lang="ts">
import Vue from "vue";
import { cashFlowFactory, paymentFactory } from "@/plugins/ethers";
// @ts-ignore-next-line
import { LineChart } from "@/plugins/chart";
import { VuetifyThemeVariant } from "vuetify/types/services/theme";
import {
  calculateTotalTransferred,
  getPaymentDetails,
  query,
} from "@/plugins/theGraph";

export default Vue.extend({
  components: {
    LineChart,
  },
  data: () => ({
    loading: true,
    datacollection: null as any,
    eventStreams: [] as string[],
    streamCount: [] as number[],
    paymentHistoryQueue: [] as number[],
    mediator: "",
    recipient: "",
    jobId: 10,
    labels: [] as string[]
  }),
  async mounted() {
    this.loading = true;
    this.mediator = await cashFlowFactory.cashflowsRecipient(this.jobId);
    this.recipient = await paymentFactory.finalApplicant(this.jobId);
    this.beginStreamListener();
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
        labels: this.labels,
        datasets: [
          {
            label: `Payment Streams for Job ${this.jobId}`,
            backgroundColor: this.color.accent,
            data: this.paymentHistoryQueue,
          },
        ],
      };
    },
    addToQueue(item: number): void {
      // create a queue of length 10
      this.paymentHistoryQueue.push(item);
      if (this.paymentHistoryQueue.length > 30)
        this.paymentHistoryQueue.shift();
    },
    getTimeStamp (): string {
      const hh = new Date().getHours();
      const ss = new Date().getSeconds();
      const mm = new Date().getMinutes();
      const ms = new Date().getMilliseconds();
      return `${hh}:${mm}:${ss}:${ms}`;
    },

    labelQueue(): void {
      this.labels.push(this.getTimeStamp());
      if (this.labels.length > 30)
        this.labels.shift();
    },

    checkQueueForChanges(): boolean {
      const queue = this.paymentHistoryQueue;
      return !(queue[0] === queue.slice(-1)[0]);
    },
    beginStreamListener(): void {
      /* 
      checks the graph every X milliseconds for the
      total amount streamed for the current job
      */
      const superFluidQuery = query(this.mediator, this.recipient);
      console.log(superFluidQuery);
      setInterval(() => {
        getPaymentDetails(this.$apolloProvider, superFluidQuery)
          .then((flow) => {
            const amountTransferredSoFar = calculateTotalTransferred(flow);
            this.labelQueue();
            this.addToQueue(amountTransferredSoFar);
            this.fillData();
          })
          .catch((err) => console.log("No Flow Data"));
      }, 500);
    },
  },
});
</script>
