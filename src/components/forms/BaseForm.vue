<template>
  <v-card :flat="formData.style">
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-form class="ma-5" @submit.prevent="submit(fields)">
        <v-row>
          <v-card-title>{{ formData.title }}</v-card-title>
        </v-row>
        <v-row v-for="field in fields" :key="field.order">
          <template v-if="isTextField(field)">
            <base-subheader :label="field.longName" />
            <v-col cols="12" :md="mdCols" :class="spacing">
              <text-field
                v-model="field.value"
                :label="field.label"
                :disabled="field.disabled"
                :rules="createRulesFrom(field.rules)"
                :default="field.default"
              />
            </v-col>
          </template>
          <template v-else-if="isDropDown(field)">
            <base-subheader :label="field.longName" />
            <v-col cols="12" :md="mdCols" :class="spacing">
              <drop-down
                v-model="field.value"
                :label="field.label"
                :disabled="field.disabled"
                :items="field.items"
                :default="field.default"
              />
            </v-col>
          </template>
          <template v-else-if="isDate(field)">
            <base-subheader :label="field.longName" />
            <v-col cols="12" :md="mdCols" :class="spacing">
              <date-picker
                :field="field"
                :disabled="field.disabled"
                :default="field.default"
                @change="updateDate"
              />
            </v-col>
          </template>
          <template v-else-if="isPassword(field)">
            <base-subheader :label="field.longName" />
            <v-col cols="12" :md="mdCols" :class="spacing">
              <password :disabled="field.disabled" />
            </v-col>
          </template>
        </v-row>
        <v-row class="mb-5">
          <v-card-actions>
            <slot name="action-button" :invalid="invalid">
              <v-btn
                type="submit"
                class="pa-5 mb-5 ml-5"
                :disabled="invalid"
                color="primary darken--5"
                large
                >{{ formData.submitText || "Submit" }}</v-btn
              >
            </slot>
            <slot name="back-button">
              <v-btn @click="$router.back()" class="pa-5 mb-5 ml-5" large text
                >Cancel</v-btn
              >
            </slot>
          </v-card-actions>
        </v-row>
      </v-form>
    </validation-observer>
  </v-card>
</template>
<script lang="ts">
import Vue from "vue";
import { ValidationObserver } from "vee-validate";
import { FormData, FormField, Rules } from "@/models/form";
import BaseSubheader from "./Base/BaseSubheader.vue";
import DatePicker from "./Base/DatePicker.vue";
import TextField from "./Base/TextField.vue";
import DropDown from "./Base/DropDown.vue";
import Password from "./Base/Password.vue";

export default Vue.extend({
  components: {
    BaseSubheader,
    DatePicker,
    TextField,
    DropDown,
    Password,
    ValidationObserver,
  },
  props: {
    formData: {
      type: Object as () => FormData,
    },
    dialog: Boolean,
  },
  data: () => ({
    textField: "" as string,
    mdCols: 9 as number,
    spacing: "md-mr-2" as string,
    date: new Date().toISOString().substr(0, 10),
  }),
  computed: {
    fields(): Array<FormField> {
      return this.formData.fields;
    },
  },
  methods: {
    submit(fields: Array<FormField>): void {
      const { onSubmit } = this.formData;
      if (onSubmit) onSubmit(fields);
      else {
        console.log("Form Submitted on " + this.$route.name);
      }
    },
    isTextField(field: FormField): boolean {
      return field.input === "text";
    },
    isDropDown(field: FormField): boolean {
      return field.input === "dropdown";
    },
    isDate(field: FormField): boolean {
      return field.input === "date";
    },
    isPassword(field: FormField): boolean {
      return field.input === "password";
    },
    createRulesFrom(rules: Rules): string {
      let ruleString = "";
      if (rules.required) {
        ruleString = this.addToRules(ruleString, "required");
      }
      if (rules.integer) {
        ruleString = this.addToRules(ruleString, "integer");
      }
      if (rules.positive) {
        ruleString = this.addToRules(ruleString, "min_value:1");
      }
      if (rules.email) {
        ruleString = this.addToRules(ruleString, "email");
      }
      return ruleString;
    },
    addToRules(ruleString: string, newRule: string): string {
      if (ruleString.length !== 0) {
        return `${ruleString}|${newRule}`;
      } else {
        return newRule;
      }
    },
  },
});
</script>
