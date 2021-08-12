<template>
  <v-container class="d-flex justify-center">
    <v-card class="base-card">
      <slot></slot>
    </v-card>
  </v-container>
</template>
<style scoped>
.base-card {
  width: 1000px;
}
.v-container {
  width: 100%;
}
</style>
