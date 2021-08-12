<template>
  <validation-provider v-slot="{ errors }" :rules="rules">
    <v-text-field
      outlined
      :label="label"
      v-bind:value="defaultOrValue"
      v-on:input="$emit('input', $event)"
      :error-messages="errors"
      :disabled="disabled"
    />
  </validation-provider>
</template>
<script lang="ts">
import Vue from "vue";
import { ValidationProvider, extend, setInteractionMode } from "vee-validate";
import {
  required,
  min_value as minValue,
  integer,
  email,
} from "vee-validate/dist/rules";

setInteractionMode("aggressive");

extend("required", {
  ...required,
  message: "This field is required",
});

extend("min_value", {
  ...minValue,
  message: "Must be a whole number greater than zero",
});

extend("integer", {
  ...integer,
  message: "Must be a whole number greater than zero",
});

extend("email", {
  ...email,
  message: "Must be a valid email address",
});

export default Vue.extend({
  name: "TextField",
  components: {
    ValidationProvider,
  },
  props: {
    label: String,
    required: Boolean,
    rules: String,
    type: {
      type: String,
      default: "",
    },
    value: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    default: String,
  },
  computed: {
    defaultOrValue(): string {
      return this.default || this.value;
    },
  },
});
</script>
