<template>
  <validation-observer>
    <validation-provider v-slot="{ errors }" rules="required|password:@confirm">
      <v-text-field
        outlined
        label="Choose a Password"
        v-model="password"
        :error-messages="errors"
        type="password"
      />
    </validation-provider>
    <validation-provider name="confirm" v-slot="{ errors }" rules="required">
      <v-text-field
        outlined
        label="Confirm Password"
        v-model="confirmation"
        :error-messages="errors"
        :disabled="disabled"
        type="password"
      />
    </validation-provider>
  </validation-observer>
</template>
<script lang="ts">
import Vue from "vue";
import {
  ValidationProvider,
  extend,
  ValidationObserver,
  setInteractionMode,
} from "vee-validate";
import { required } from "vee-validate/dist/rules";

type VModel = null | string;

setInteractionMode("eager");

extend("password", {
  params: ["target"],
  // this is from the vee-validate docs
  // eslint-disable-next-line
  validate (value, { target }: Record<string, any>): boolean {
    return value === target;
  },
  message: "Passwords do not match",
});

extend("required", {
  ...required,
  message: "This field is required",
});

export default Vue.extend({
  name: "TextField",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    password: null as VModel,
    confirmation: null as VModel,
  }),
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
