<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="d-flex justify-space-between">
          <v-card-title>Payment Setup Dashboard</v-card-title>
          <v-card-actions>
            <v-btn @click="startFlow()" class="primary">
              Start Flow
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-progress-linear indeterminate v-if="loading"/>
      </v-col>
    </v-row>
    <v-row >
      <v-col cols="6">
        <v-row>
          <base-card>
            <v-card-text><strong>JobID:</strong> {{ jobId }}</v-card-text>
            <v-card-text
              ><strong>Sender:</strong> {{ sender }}</v-card-text
            >
            <v-card-text
              ><strong>CashFlow Recipient Address:</strong>
              {{ mediator }}</v-card-text
            >
            <v-card-text
              ><strong>Final Applicant:</strong>
              {{ recipient }}</v-card-text
            >
            <v-card-text
              ><strong>DAIx Per Month:</strong> {{ currentFlow }}</v-card-text
            >
            <v-card-text
              ><strong>Max Flow Rate:</strong> {{ maxFlow }}</v-card-text
            >
            <v-card-text
              ><strong>Super Token Address: </strong>
              {{ fDaiXtoken }}</v-card-text
            >
          </base-card>
        </v-row>
        <v-row>
          <base-card>
            <v-card-title>Flow Rate Calcuator</v-card-title>
            <v-text-field
              class="mx-5"
              v-model="daiPerMonth"
              label="DAI Per Month"
            />
            <v-card-subtitle
              ><strong>Flow Rate is:</strong>
              {{ flowRateComputed }}</v-card-subtitle
            >
          </base-card>
        </v-row>
      </v-col>
      <v-col cols="6">
        <base-card style="height: 100%">
          <v-card-title>Live Flow</v-card-title>
          <div class="my-5 d-flex justify-center align-center">
            <v-progress-circular
              :size="300"
              :width="20"
              color="primary"
              :indeterminate="streaming"
              large
              class="primary--text"
              ><p>
                {{ amountTransferred.toFixed(5) }} DAIx
              </p></v-progress-circular
            >
          </div>
        </base-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import BaseCard from "@/components/BaseCard.vue";
import BaseForm from "@/components/forms/BaseForm.vue";
import { SuperfluidFlow } from "@/models/graphql";
import {
  query,
  getPaymentDetails,
  calculateTotalTransferred,
} from "@/plugins/theGraph";
import Vue from "vue";
import SuperFluidWrapper, {
  CashFlowAddresses,
  CashFlows,
  SUPERTOKEN_ADDRESS,
} from "@/plugins/superfluid";
import { FormField } from "@/models/form";

export default Vue.extend({
  components: { BaseCard, BaseForm },
  data: () => ({
    streaming: false,
    fDaiXtoken: SUPERTOKEN_ADDRESS,
    amountTransferred: 0,
    daiPerMonth: 0,
    sender: '...loading',
    recipient: '...loading',
    mediator: '...loading',
    currentFlow: '...loading' as string | number,
    maxFlow: '...loading' as string | number,
    loading: false,
    flow: {} as SuperfluidFlow,
    paymentHistoryQueue: [] as number[]
  }),
  computed: {
    jobId(): number {
      return Number(this.$route.params.jobId);
    },

    addresses(): CashFlowAddresses {
      return this.sfWrapper.addresses;
    },

    sfWrapper(): SuperFluidWrapper {
      return new SuperFluidWrapper(this.jobId)
    },

    flows(): CashFlows {
      return this.sfWrapper.flows;
    },
    flowRateComputed(): number {
      const perday = this.daiPerMonth / 30;
      const perhour = perday / 24;
      const persecond = perhour / 3600;
      const flowRateDigits = Math.pow(10, 18);
      return Math.round(persecond * flowRateDigits);
    },
  },
  methods: {
    async startFlow(): Promise<void> {
      this.loading = true;
      console.log(this.sfWrapper.flows)
      await this.sfWrapper.startPayment();
      this.loading = false;
    },

    updatePageWithCurrentJobId(data: FormField[]): void {
      this.jobId = data[0].value as number;
      this.populatePage()
    },

    async populatePage(): Promise<void> {
      this.loading = true;
      await this.sfWrapper.initialize()
      this.mediator = this.sfWrapper.addresses.mediator;
      this.recipient = this.sfWrapper.addresses.recipient;
      this.sender = this.sfWrapper.addresses.sender;
      this.currentFlow = this.sfWrapper.flows.current;
      this.maxFlow = this.sfWrapper.flows.max;

      this.beginStreamListener()

      this.loading = false;
    },

    addToQueue (item: number): void {
      // create a queue of length 10
      this.paymentHistoryQueue.push(item);
      if (this.paymentHistoryQueue.length > 10) this.paymentHistoryQueue.shift();
    },

    checkQueueForChanges(): boolean {
      const queue = this.paymentHistoryQueue;
      return !(queue[0] === queue.slice(-1)[0]);
    },

    calculateIfStreaming(amountTransferredSoFar: number): void {
      // if money is coming in, we are streaming successfully
      this.addToQueue(amountTransferredSoFar);
      this.checkQueueForChanges()
        ? this.streaming = true
        : this.streaming = false;
    },

    beginStreamListener(): void {
      /* 
      checks the graph every X milliseconds for the
      total amount streamed for the current job
      */
      const superFluidQuery = query(
        this.mediator,
        this.recipient
      );
      console.log(superFluidQuery);
      setInterval(() => {
        getPaymentDetails(this.$apolloProvider, superFluidQuery)
          .then(flow => {
            const amountTransferredSoFar = calculateTotalTransferred(flow);
            this.calculateIfStreaming(amountTransferredSoFar);
            this.amountTransferred = amountTransferredSoFar;
          })
          .catch(err => console.log('No Flow Data'));
      }, 500);
    },
  },
  async mounted() {
    await this.populatePage();
  },
});
</script>

<style></style>
