<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-toolbar-title class="white--text">Welcome to RhadaPay</v-toolbar-title>
      <v-spacer />
      <v-toolbar-title class="white--text">{{ name }}</v-toolbar-title>
      <v-spacer />
      <v-btn dark outlined @click="toggleTheme">
        <v-icon>{{ icon }}</v-icon>
        {{ theme }}
      </v-btn>
    </v-app-bar>
    <v-main class="my-5 d-flex justify-center align-center">
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
    icon(): string {
      return this.$vuetify.theme.dark
        ? "mdi-weather-night"
        : "mdi-weather-sunny";
    },
    name(): string {
      return this.$vuetify.theme.dark
        ? "Carey"
        : "Mark";
    },
  },

  methods: {
    toggleTheme(): void {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
});
</script>
<style scoped>
* {
  box-sizing: border-box;
}

html,
body,
.v-main {
  height: 100%;
}
</style>
