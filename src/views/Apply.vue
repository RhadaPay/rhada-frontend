<template>
  <base-card>
    <div class="d-flex justify-space-between">
      <v-card-title>Manage Jobs</v-card-title>
      <v-card-actions>
        <v-btn dark icon class="accent" @click="refresh()">
          <v-icon v-if="!loading">mdi-refresh</v-icon>
          <v-progress-circular v-else indeterminate />
        </v-btn>
      </v-card-actions>
    </div>
    <v-data-table
      :loading="loading"
      v-model="selected"
      :headers="headers"
      :items="tableData"
    >
      <template v-slot:[`item.apply`]="props">
        <v-btn
          class="details"
          depressed
          icon
          small
          dark
          color="primary"
          @click="onButtonClick(props.item)"
          ><v-icon>mdi-view-list</v-icon></v-btn
        >
      </template>
      <template v-slot:[`item.sign`]="props">
        <v-btn
          class="details"
          depressed
          icon
          small
          dark
          color="primary"
          @click="onButtonClick(props.item)"
          ><v-icon>mdi-check</v-icon></v-btn
        >
      </template>
    </v-data-table>
  </base-card>
</template>
<script lang="ts">
import Vue from "vue";
import BaseCard from "@/components/BaseCard.vue";
import { paymentFactory } from "@/plugins/ethers";

interface TableData {
  id: number;
  descriptor: string;
  deadline: string;
  refreshRate: number;
  eventStream: string;
  percentage: number;
  downPayment: number;
}

interface TableHeaders {
  text: string;
  value: keyof TableData | "apply" | "sign";
}

export default Vue.extend({
  components: {
    BaseCard,
  },
  data: () => ({
    loading: false,
    selected: [],
    tableData: [] as Array<TableData>,
  }),
  computed: {
    headers(): TableHeaders[] {
      return [
        {
          text: "Description",
          value: "descriptor",
        },
        {
          text: "Deadline",
          value: "deadline",
        },
        {
          text: "Event",
          value: "eventStream",
        },
        {
          text: "Percentage Target",
          value: "percentage",
        },
        {
          text: "Down Payment",
          value: "downPayment",
        },
        {
          text: "Apply",
          value: "apply",
        },
        {
          text: "Sign",
          value: "sign",
        },
      ];
    },
  },
  methods: {
    onButtonClick(item: TableData): void {
      console.log("Take me to the apply for job screen");
      this.$router.push({ name: "ApplyComplete" });
    },
    async getTableData(): Promise<void> {
      const jobs = await paymentFactory.getJobs();
      const rows: TableData[] = [];
      jobs.forEach(async (job, jobId) => {
        const tableRow: TableData = {
          id: jobId,
          descriptor: job.descriptor,
          deadline: new Date(job.deadline.toNumber())
            .toISOString()
            .substring(0, 10),
          refreshRate: job.refreshRate.toNumber(),
          eventStream: await paymentFactory.eventStreams(
            job.eventStreamId.toNumber()
          ),
          percentage: job.percentage,
          downPayment: job.amount.toNumber(),
        };
        rows.push(tableRow);
      });
      this.tableData = rows;
    },
    async refresh(): Promise<void> {
      this.loading = true;
      await this.getTableData();
      this.loading = false;
    },
  },
  async mounted() {
    this.refresh();
  },
});
</script>
