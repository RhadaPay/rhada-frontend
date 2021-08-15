<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card><v-card-title>Payments Dashboard</v-card-title></v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-row>
          <base-card>
            <v-card-text><strong>JobID:</strong> {{ jobId }}</v-card-text>
            <v-card-text
              ><strong>Sender:</strong> {{ senderAddress }}</v-card-text
            >
            <v-card-text
              ><strong>CashFlow Recipient Address:</strong>
              {{ recipientAddress }}</v-card-text
            >
            <v-card-text
              ><strong>Final Applicant:</strong>
              {{ finalApplicant }}</v-card-text
            >
            <v-card-text
              ><strong>DAIx Per Month:</strong> {{ flowRate }}</v-card-text
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
              indeterminate
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
    <v-row>
      <v-col cols="12">
        <base-form :formData="formData" :key="formData.fields.length" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import SuperfluidSDK from "@superfluid-finance/js-sdk";
import BaseCard from "@/components/BaseCard.vue";
import BaseForm from "@/components/forms/BaseForm.vue";
import { SuperfluidGraphQLResult, SuperfluidFlow } from "@/models/graphql";
import Vue from "vue";
import { paymentFactory, cashFlowFactory } from "@/plugins/ethers";
import { Framework } from "@superfluid-finance/js-sdk/src/Framework";
import gql from "graphql-tag";
import { ApolloQueryResult } from "apollo-client";
import { BigNumber, ethers } from "ethers";
import { FormData } from "@/models/form";

export default Vue.extend({
  components: { BaseCard, BaseForm },
  data: () => ({
    formData: {
      title: "Setup a New Payment Flow",
      fields: [
        {
          order: 0,
          label: "Input the Address of the Recipient Smart Contract",
          name: "recipient",
          longName: "Recipient",
          input: "text",
          rules: {
            required: true,
          },
          default: "0x1df27a35703914574e690869b11643d7cd877235",
        },
        {
          order: 1,
          label: "Set a max flow rate",
          name: "maximumFlowRate",
          longName: "Maximum Flow",
          input: "text",
          rules: {
            required: true,
            integer: true,
          },
        },
      ],
    } as FormData,
    recipientAddress: "",
    amountTransferred: 0,
    senderAddress: "" as string | null, // sender?
    finalApplicant: "",
    flowRate: 0,
    provider: paymentFactory.provider,
    fDaiXtoken: "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f",
    flow: {} as SuperfluidFlow,
    daiPerMonth: 0,
    jobId: 8,
  }),
  computed: {
    sf(): Framework {
      return new SuperfluidSDK.Framework({
        ethers: this.provider,
      });
    },
    flowRateComputed(): number {
      const perday = this.daiPerMonth / 30;
      const perhour = perday / 24;
      const persecond = perhour / 3600;
      const flowRateDigits = Math.pow(10, 18);
      return Math.round(persecond * flowRateDigits);
    },
    query(): string {
      /*
       * TheGraph query on https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-mumbai
       * IMPORTANT: both addresses must be lowercase and the formula to calculate the total received is: sum + flowRate(currentTimestamp-lastUpdate)
       */
      return `{
          tokens(where: { symbol: "fDAIx" }) {
              flows(
                  where: {
                      owner: "${this.recipientAddress.toLowerCase()}"
                      recipient: "${this.finalApplicant.toLowerCase()}"
                  }
              ) {
                  sum
                  flowRate
                  lastUpdate
              }
            }
          }`;
    },
  },
  methods: {
    calculateTotalTransferred(flow: SuperfluidFlow): number {
      // https://docs.superfluid.finance/superfluid/docs/subgraph#how-much-usdcx-has-alice-streamed-to-bob
      const sum = Number(flow.sum);
      const flowRate = Number(flow.flowRate);
      const lastUpdate = Number(flow.lastUpdate);
      const nowInSeconds = Math.round(Date.now() / 1000);

      const sinceNow = nowInSeconds - lastUpdate;
      const formula: number = sum + flowRate * sinceNow;

      return formula / Math.pow(10, 18);
    },
    async getCashFlowParams(jobId: number): Promise<void> {
      this.senderAddress = await cashFlowFactory.cashflowsSender(jobId);
      this.recipientAddress = await cashFlowFactory.cashflowsRecipient(jobId);
      this.finalApplicant = await paymentFactory.finalApplicant(jobId);
      const flowRateBig = await cashFlowFactory.maxAllowedFlows(jobId);
      this.flowRate = this.flowRatePerMonth(flowRateBig.toNumber());
    },
    flowRatePerMonth(flowRate: number): number {
      const digits = Math.pow(10, 18);
      const perMonth = 30 * 24 * 3600;
      return Math.round((flowRate * perMonth) / digits);
    },
    async startPayment() {
      const user = this.sf.user({
        address: this.senderAddress!, // TODO: should be equal to TradeableCashflowWithAllowanceFactory.cashflowsSender(jobId)
        token: this.fDaiXtoken, // thhis is the single token you start with
      });

      // await user.flow({
      //   recipient: "", //TODO: should be calling TradeableCashflowWithAllowanceFactory.cashflowsRecipient(jobId)
      //   flowRate: "", //TODO: should be calling TradeableCashflowWithAllowanceFactory.maxAllowedFlows(jobId)
      // });
    },
    async getPaymentDetails(): Promise<SuperfluidFlow> {
      /*
        Query the graph for current details of the superfluid flow
      */
      let result: ApolloQueryResult<SuperfluidGraphQLResult>;
      result = await this.$apolloProvider.defaultClient.query({
        query: gql(this.query),
      });
      const flow = result.data.tokens[0].flows[0];
      this.amountTransferred = this.calculateTotalTransferred(flow);
      return flow;
    },
  },
  async mounted() {
    await this.getCashFlowParams(this.jobId); // TODO: Get the jobId
    this.formData.onSubmit = this.getPaymentDetails;
    this.senderAddress = await paymentFactory.signer.getAddress();
    setInterval(() => this.getPaymentDetails(), 333);
    // await this.sf.initialize();
  },
});
</script>

<style></style>
