<script setup>
import Navigation from "@components/common/Navigation.vue";
import Footer from "@components/common/Footer.vue";
import VstiView from "./views/vsti/VstiView.vue";
</script>

<template>
  <div class="flex w-full h-full">
    <!-- <div
      class="box-content justify-start flex-none shadow-lg z-10 shadow-black"
    >
      <Navigation />
    </div> -->
    <div class="flex-grow flex flex-col">
      <VstiView />
    </div>
  </div>
  <!-- <Footer></Footer> -->
</template>

<style scoped></style>
