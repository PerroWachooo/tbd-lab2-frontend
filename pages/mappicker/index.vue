<template>
  <div>
    <MapOneLocation ref="mapComponent" />
    <button @click="addCustomMarker">Add Custom Marker</button>
    <button @click="clearCurrentMarker">Clear Current Marker</button>
  </div>
</template>

<script setup>
import MapOneLocation from '~/components/MapOneLocation.vue';

const addCustomMarker = () => {
  // Dynamically add a marker from the parent
  if (this.$refs.mapComponent && this.$refs.mapComponent.addMarker) {
    this.$refs.mapComponent.addMarker({
      name: 'Dynamic Marker',
      coordinates: [-73.975, 40.765],
      description: 'A custom marker added dynamically from the parent component'
    });
  }
}

const clearCurrentMarker = () => {
  // Clear the current marker from the map
  if (this.$refs.mapComponent && this.$refs.mapComponent.removeCurrentMarker) {
    this.$refs.mapComponent.removeCurrentMarker();
  }
}
</script>
