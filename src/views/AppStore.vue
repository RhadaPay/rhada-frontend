/* eslint-disable */
<template>
    <base-card>
      <v-card-title>
        Download the NFT Gallery Now!
      </v-card-title>
      <v-img :class="`${flash ? 'intense' : ''}`" src="../assets/nftimg.jpg"/>
      <v-card-actions class="ma-2">
        <v-btn medium color="primary" @click="download(2)">
          Download
        </v-btn>
      </v-card-actions>
    </base-card>
</template>
<script lang="ts">
import BaseCard from "@/components/BaseCard.vue";
import axios from "axios";
import Vue from "vue";
export default Vue.extend({
  components: {
    BaseCard,
  },
  data: () => ({
    loading: false,
    flash: false
  }),
  methods: {
    async download(eventStreamId: number) {
      this.flashComplete();      
      await axios.post('http://localhost:3000/events', {
        eventStreamId
      })
    },
    flashComplete() {
      this.flash = true;
      setTimeout(() => {
        this.flash = false
      }, 500);
    }
  }
});
</script>
<style scoped>
.intense {
  animation-name: glow;
  animation-iteration-count: infinite;
  animation-duration: 0.1s;
}

.soft {
  animation-name: glow;
  animation-iteration-count: infinite;
  animation-duration: 5s;
}

@keyframes glow {
  0% {
    box-shadow: 0;
  }
  50% {
    box-shadow:  0 0 50px rgb(47, 174, 216);
  }
  100% {
    box-shadow: 0;
  }  
}
</style>
