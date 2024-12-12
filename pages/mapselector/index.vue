<template>
    <div>
      <MapOneLocation ref="mapComponent" />
      <button @click="selectLocation(0)">Statue of Liberty</button>
      <button @click="selectLocation(1)">Times Square</button>
      <button @click="selectLocation(2)">Brooklyn Bridge</button>
      <button @click="selectLocation(3)">Central Park</button>
    </div>
  </template>
  
  <script setup>
  import MapOneLocation from '~/components/MapSelector.vue';
  
  const selectLocation = (index) => {
    if (this.$refs.mapComponent && this.$refs.mapComponent.toggleLocationSelection) {
      this.$refs.mapComponent.toggleLocationSelection(index);
    }
  }
  </script>
  