<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-app-bar-title>Welcome to RhadaPay</v-app-bar-title>
      <v-spacer />
      <v-switch :label="theme" @change="toggleTheme" />
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => ({}),

  computed: {
    theme(): string {
      return this.$vuetify.theme.dark ? "Dark" : "Light";
    },
  },

  methods: {
    toggleTheme(): void {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
});
</script>
