<template>
  <base-card>
    <v-form class="pa-5">
      <v-text-field label="Recipient Address" v-model="jobId"> </v-text-field>

      <v-text-field label="Maximum Flow Rate" v-model="flowRate">
      </v-text-field>

      <v-btn @click="startPayment"> Start Payment </v-btn>
    </v-form>
  </base-card>
</template>

<script>
import SuperfluidSDK from "@superfluid-finance/js-sdk";
import { Web3Provider } from "@ethersproject/providers";
import BaseCard from "@/components/BaseCard.vue";

export default {
  components: { BaseCard },
  props: {
    jobId: {
      required: false,
      default: "0",
    },
  },
  data() {
    return {
      sf: null,
      walletAddress: null,
      recipientAddress: "",
    };
  },
/* TheGraph query on https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-mumbai

{
    tokens(where: { symbol: "fDAIx" }) {
        flows(
            where: {
                owner: "0x8f6112872339bf00e9985067301a0636957c6b81" cashflowsRecipient(jobId)
           			recipient: "0x1df27a35703914574e690869b11643d7cd877235" finalApplicant(jobId)
            }
        ) {
            sum
            flowRate
      			lastUpdate
        }
    }
  }

  IMPORTANT: both addresses must be lowercase and the formula to calculate the total received is: sum + flowRate(currentTimestamp-lastUpdate)
*/
  async mounted() {
    this.walletAddress = await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });

    this.sf = new SuperfluidSDK.Framework({
      ethers: new Web3Provider(window.ethereum),
    });
    await this.sf.initialize();
  },
  methods: {
    async startPayment() {
      const user = this.sf.user({
        address: this.walletAddress[0], // TODO: should be equal to TradeableCashflowWithAllowanceFactory.cashflowsSender(jobId)
        //fDaiX on Mumbai address
        token: "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f",
      });

      //Only works sometimes, should use the superfluid rpc https://rpc-endpoints.superfluid.dev/matic or thegraph implementations
      const details = await user.details();
      console.log(details);

      await user.flow({
        recipient: "", //TODO: should be calling TradeableCashflowWithAllowanceFactory.cashflowsRecipient(jobId)
        flowRate: "", //TODO: should be calling TradeableCashflowWithAllowanceFactory.maxAllowedFlows(jobId)
      });
    },
  },
};
</script>

<style>
</style>