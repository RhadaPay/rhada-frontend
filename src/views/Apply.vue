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
        v-model="hideComplete"/>        
      </v-card-actions>
    </div>
    <v-data-table
      :loading="loading"
      v-model="selected"
      :headers="headers"
      :items="tableData.filter(row => !row.finalSign || hideComplete)"
    >
      <template v-slot:[`item.applyForJob`]="props">
        <v-btn
          class="details"
          depressed
          :disabled="props.item.creator === currentAddress || !!props.item.finalApplicant"
          icon
          small
          dark
          color="primary"
          @click="applyForJob(props.item)"
          ><the-select-box :complete="!!props.item.finalApplicant"/></v-btn
        >
      </template>
      <template v-slot:[`item.chooseApplicant`]="props">
        <v-btn
          class="details"
          :disabled="props.item.creator !== currentAddress || !!props.item.finalApplicant"
          depressed
          icon
          small
          dark
          color="primary"
          @click="confirmApplicant(props.item)"
          ><the-select-box :complete="!!props.item.finalApplicant"/></v-btn
        >
      </template>
      <template v-slot:[`item.initApplicantSign`]="props">
        <v-btn
          class="details"
          :disabled="props.item.finalApplicant !== currentAddress || props.item.applicantSigned"
          depressed
          icon
          small
          dark
          color="primary"
          @click="applicantSign(props.item)"
          ><the-select-box :complete="props.item.applicantSigned"/></v-btn
        >
      </template>
      <template v-slot:[`item.initCreatorSign`]="props">
        <v-btn
          class="details"
          :disabled="props.item.creator !== currentAddress || props.item.creatorSigned"
          depressed
          icon
          small
          dark
          color="primary"
          @click="creatorSign(props.item)"
          ><the-select-box :complete="props.item.creatorSigned"/></v-btn
        >
      </template> 
      <template v-slot:[`item.submitWork`]="props">
        <v-btn
          class="details"
          :disabled="props.item.finalApplicant !== currentAddress || props.item.workSubmitted"
          depressed
          icon
          small
          dark
          color="primary"
          @click="submitWork(props.item)"
          ><the-select-box :complete="props.item.workSubmitted"/></v-btn
        >
      </template>
      <template v-slot:[`item.finalSign`]="props">
        <v-btn
          class="details"
          :disabled="props.item.creator !== currentAddress || props.item.finalSign"
          depressed
          icon
          small
          dark
          color="primary"
          @click="finalSign(props.item)"
          ><the-select-box :complete="props.item.finalSign"/></v-btn
        >
      </template>                               
    </v-data-table>
  </base-card>
</template>
<script lang="ts">
import Vue from "vue";
import BaseCard from "@/components/BaseCard.vue";
import TheSelectBox from "@/components/TheSelectBox.vue";
import { paymentFactory } from "@/plugins/ethers";

interface TableData {
  id: number;
  descriptor: string;
  deadline: string;
  refreshRate: number;
  eventStream: string;
  percentage: number;
  downPayment: number;
  creator: string;
  finalApplicant: string;
  applicantSigned: boolean;
  creatorSigned: boolean;
  workSubmitted: boolean;
  finalSign: boolean;
}

interface TableHeaders {
  text: string;
  value: keyof TableData | ApplicationStages
}

type ApplicationStages = "applyForJob"
  | "chooseApplicant"
  | "initApplicantSign"
  | "initCreatorSign"
  | "submitWork"
  | "finalSign"
  ;

export default Vue.extend({
  components: {
    BaseCard,
    TheSelectBox
  },
  data: () => ({
    hideComplete: true,
    loading: false,
    currentAddress: '',
    selected: [],
    tableData: [] as Array<TableData>,
  }),
  computed: {
    headers(): TableHeaders[] {
      return [
        {
          text: "Job ID",
          value: 'id'
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
        value: 1
      });
      this.loading = false;
    },
    async submitWork(item: TableData): Promise<void> {
      this.loading = true;
      await paymentFactory.submitWork(item.id, 'NOT PROVIDED');
      this.loading = false;
    },
    async finalSign(item: TableData): Promise<void> {
      this.loading = true;
      const allowedFlow = 289351851851852;
      const maxAllowedFlow = 578703703703704
      await paymentFactory.finalSign(true, item.id, allowedFlow, maxAllowedFlow);
      this.loading = false;
    },
    async getTableData(): Promise<void> {
      this.loading = true;
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
          creator: job.creator,
          finalApplicant: await paymentFactory.finalApplicant(jobId),
          applicantSigned: job.applicantSigned,
          creatorSigned: job.creatorSigned,
          workSubmitted: job.workSubmitted,
          percentage: job.percentage,
          downPayment: job.amount.toNumber(),
          finalSign: job.state === 3
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
    this.currentAddress = await paymentFactory.signer.getAddress();
  },
});
</script>
