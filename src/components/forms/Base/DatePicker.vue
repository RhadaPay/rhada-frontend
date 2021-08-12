<template>
  <span>
    <v-menu
      :ref="field.dateMeta.ref"
      v-model="field.dateMeta.menu"
      :close-on-content-click="false"
      :return-value.sync="field.dateMeta.date"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="field.dateMeta.date"
          :label="field.label"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="field.dateMeta.date"
        no-title
        scrollable
        :disabled="disabled"
        :allowed-dates="disablePastDates"
      >
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="field.dateMeta.menu = false">
          Cancel
        </v-btn>
        <v-btn text color="primary" @click="saveDate(field)"> OK </v-btn>
      </v-date-picker>
    </v-menu>
  </span>
</template>
<script lang="ts">
import Vue from "vue";
import { FormField } from "@/models/form";
declare interface Ref {
  // eslint-disable-next-line
  save(val: any): void;
}
export default Vue.extend({
  props: {
    field: Object as () => FormField,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    menu: false as boolean,
  }),
  methods: {
    saveDate(field: FormField): void {
      if (field.dateMeta) {
        const ref = field.dateMeta.ref;
        const dateRef = this.$refs[ref] as unknown as Ref;
        dateRef.save(field.dateMeta.date);
      } else {
        console.warn("dateMeta is not defined");
      }
    },
    disablePastDates(allowedDate: string) {
      const now = new Date().toISOString().substr(0, 10);
      return allowedDate >= now;
    },
  },
});
</script>
