<template>
  <base-card>
    <div class="d-flex justify-space-between">
      <v-card-title>Manage Jobs</v-card-title>
      <v-card-actions>
        <v-btn dark icon class="accent" @click="refresh()">
          <v-icon v-if="!loading">mdi-refresh</v-icon>
          <v-progress-circular v-else indeterminate />
        </v-btn>
        <v-switch
          class="mx-3"
          :label="`${hideComplete ? 'Show' : 'Hide'} Completed`"
          v-model="hideComplete"
        />
      </v-card-actions>
    </div>
    <v-data-table
      :loading="loading"
      v-model="selected"
      :headers="headers"
      :items="tableData.filter((row) => !row.finalSign || hideComplete)"
    >
      <template v-slot:[`item.applyForJob`]="props">
        <signing-button
          :disabled="
            props.item.creator === currentAddress || props.item.applicantSigned
          "
          @click="applyForJob(props.item)"
          :complete="props.item.applicantSigned"
        />
      </template>
      <template v-slot:[`item.chooseApplicant`]="props">
        <signing-button
          :disabled="
            props.item.creator !== currentAddress || props.item.applicantSigned
          "
          @click="confirmApplicant(props.item)"
          :complete="props.item.applicantSigned"
        />
      </template>
      <template v-slot:[`item.initApplicantSign`]="props">
        <signing-button
          :disabled="
            props.item.finalApplicant !== currentAddress ||
            props.item.applicantSigned
          "
          @click="applicantSign(props.item)"
          :complete="props.item.applicantSigned"
        />
      </template>
      <template v-slot:[`item.initCreatorSign`]="props">
        <signing-button
          :disabled="
            props.item.creator !== currentAddress || props.item.creatorSigned
          "
          @click="creatorSign(props.item)"
          :complete="props.item.creatorSigned"
        />
      </template>
      <template v-slot:[`item.submitWork`]="props">
        <signing-button
          :disabled="
            props.item.finalApplicant !== currentAddress ||
            props.item.workSubmitted
          "
          @click="submitWork(props.item)"
          :complete="props.item.workSubmitted"
        />
      </template>
      <template v-slot:[`item.finalSign`]="props">
        <signing-button
          :disabled="
            props.item.creator !== currentAddress || props.item.finalSign
          "
          @click="finalSign(props.item)"
          :complete="props.item.finalSign"
        />
      </template>
    </v-data-table>
  </base-card>
</template>
<script lang="ts">
import Vue from "vue";
import BaseCard from "@/components/BaseCard.vue";
import SigningButton from "@/components/SigningButton.vue";
import { paymentFactory } from "@/plugins/ethers";
import { TableData, TableHeaders } from "@/models/table";

export default Vue.extend({
  components: {
    BaseCard,
    SigningButton,
  },
  data: () => ({
    hideComplete: true,
    loading: false,
    currentAddress: "",
    selected: [],
    tableData: [] as Array<TableData>,
  }),
  computed: {
    headers(): TableHeaders[] {
      return [
        {
          text: "Job ID",
          value: "id",
        },
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
          value: "applyForJob",
        },
        {
          text: "Confirm Applicant",
          value: "chooseApplicant",
        },
        {
          text: "Applicant Started",
          value: "initApplicantSign",
        },
        {
          text: "Terms Agreed",
          value: "initCreatorSign",
        },
        {
          text: "Work Submitted",
          value: "submitWork",
        },
        {
          text: "Final Sign",
          value: "finalSign",
        },
      ];
    },
  },
  methods: {
    async applyForJob(item: TableData): Promise<void> {
      this.loading = true;
      await paymentFactory.applyForJob(item.id);
      this.loading = false;
    },
    async confirmApplicant(item: TableData): Promise<void> {
      this.loading = true;
      const applicant = await paymentFactory.jobToApplicants(item.id, 0);
      await paymentFactory.chooseApplicant(applicant, item.id);
      this.loading = false;
    },
    async applicantSign(item: TableData): Promise<void> {
      this.loading = true;
      await paymentFactory.initApplicantSign(item.id);
      this.loading = false;
    },
    async creatorSign(item: TableData): Promise<void> {
      this.loading = true;
      console.log(item);
      await paymentFactory.initCreatorSign(item.id, {
        value: item.downPayment,
      });
      this.loading = false;
    },
    async submitWork(item: TableData): Promise<void> {
      this.loading = true;
      await paymentFactory.submitWork(item.id, "NOT PROVIDED");
      this.loading = false;
    },
    async finalSign(item: TableData): Promise<void> {
      this.loading = true;
      const allowedFlow = 289351851851852;
      const maxAllowedFlow = 578703703703704;
      await paymentFactory.finalSign(
        true,
        item.id,
        allowedFlow,
        maxAllowedFlow
      );
      this.loading = false;
    },
    async getTableData(): Promise<void> {
      this.loading = true;
      const rows: TableData[] = [];

      const jobs = await paymentFactory.getJobs();
      jobs.forEach(async (job, id) => {
        // Destructure constants
        const {
          descriptor,
          creatorSigned,
          workSubmitted,
          percentage,
          applicantSigned,
          creator,
        } = job;

        // convert big numbers to numbers
        const deadline = job.deadline.toNumber();
        const refreshRate = job.refreshRate.toNumber();
        const downPayment = job.amount.toNumber();
        const eventStreamId = job.eventStreamId.toNumber();

        // additional data calls
        const eventStream = await paymentFactory.eventStreams(eventStreamId);
        const finalApplicant = await paymentFactory.finalApplicant(id);

        // create object and push
        rows.push({
          id,
          descriptor,
          applicantSigned,
          creatorSigned,
          workSubmitted,
          percentage,
          creator,
          refreshRate,
          eventStream,
          finalApplicant,
          downPayment,
          deadline: new Date(deadline).toISOString().substring(0, 10),
          finalSign: job.state === 3,
        });
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
    this.currentAddress = await paymentFactory.signer.getAddress();
  },
});
</script>
