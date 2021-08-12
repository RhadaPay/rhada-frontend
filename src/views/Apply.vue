<template>
  <base-card>
    <v-card-title>
      Apply For a Job
    </v-card-title>  
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="tableData">
    <template
    v-slot:[`item.controls`]="props">
    <v-btn
      class="details"
      depressed
      icon
      small
      dark
      color="primary"
      @click="onButtonClick(props.item)"
    ><v-icon>mdi-view-list</v-icon></v-btn>
    </template>    
    </v-data-table>
  </base-card>
</template>
<script lang="ts">
import Vue from 'vue';
import BaseCard from '@/components/BaseCard.vue'

interface TableData {
  id: number;
  descriptor: string;
  deadline: string;
  refreshRate: number;
  eventStream: string;
  percentage: number;
  downPayment: number;
};

interface TableHeaders { 
  text: string;
  value: keyof TableData | 'controls';
};

export default Vue.extend({
  components: {
    BaseCard
  },
  data: () => ({
    selected: [],
    tableData: [
      {
        id: 1,
        descriptor: 'Create Me a new App',
        deadline: new Date().toISOString().substring(0, 10),
        refreshRate: 100,
        eventStream: 'App Downloads',
        percentage: 5,
        downPayment: 100,
      },
    ] as Array<TableData>
  }),
  computed: {
    headers (): TableHeaders[] {
      return [
        {
          text: 'Description', value: 'descriptor'
        },
        {
          text: 'Deadline', value: 'deadline'
        },
        {
          text: 'Event', value: 'eventStream'
        },
        {
          text: 'Percentage Target', value: 'percentage'
        },
        {
          text: 'Down Payment', value: 'downPayment'
        },
        {
          text: 'Apply', value: 'controls'
        }        
      ]
    }
  },
  methods: {
    onButtonClick (): void {
      console.log('Take me to the apply for job screen');
    }
  }
})
</script>
