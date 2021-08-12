<template v-else-if="isDropDown(field)">
  <validation-provider v-slot="{ errors }" :rules="rules">
    <v-select
      outlined
      :label="label"
      :items="items"
      item-text="text"
      item-value="value"
      v-bind:value="defaultOrItem"
      v-on:input="$emit('input', $event)"
      :error-messages="errors"
      :disabled="disabled"
    />
  </validation-provider>
</template>
<script lang="ts">
import Vue from "vue";
import { ValidationProvider, extend, setInteractionMode } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import { Item } from "@/models/form";
setInteractionMode("eager");

extend("required", {
  ...required,
  message: "This field is required",
});

export default Vue.extend({
  name: "DropDown",
  components: {
    ValidationProvider,
  },
  data: () => ({
    model: null as null | string,
  }),
  props: {
    label: String,
    required: Boolean,
    items: {
      type: Array as () => Array<Item>,
    },
    rules: String,
    value: {
      type: [String, Number],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    default: {
      type: Object as () => Item,
    },
  },
  computed: {
    defaultOrItem(): string | number | boolean {
      return this.default.value || this.value;
    },
  },
});
</script>
