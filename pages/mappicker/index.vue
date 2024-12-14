<template>
  <div>
    <MapOneLocation ref="mapComponent" />
    <button @click="addCustomMarker">Add Custom Marker</button>
    <button @click="clearCurrentMarker">Clear Current Marker</button>
    <v-dialog v-model="dialogDireccion" max-width="600px">
  <v-card>
    <v-card-title>
      <span class="headline">Seleccionar Dirección</span>
    </v-card-title>
    <v-card-text>
      <MapOneLocation ref="addressPickerMap" />
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="dialogDireccion = false">Cancelar</v-btn>
      <v-btn color="green darken-1" text @click="confirmAddressSelection">Confirmar</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

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
