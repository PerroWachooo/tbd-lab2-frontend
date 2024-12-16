<template>
    <div class="map-page">
      <!-- Dropdown for selecting items (clients or warehouses) -->
      <div class="search-container">
        <select id="item-select" v-model="selectedItemId" @change="focusOnItem" class="search-dropdown">
          <option v-for="item in items" :key="item.id" :value="item.id">
            {{ item.nombre }}
          </option>
        </select>
      </div>
  
      <!-- Map container -->
      <div ref="mapContainer" class="map-container" role="region" aria-label="Interactive map">
        <div v-if="!isMapLoaded" class="map-loading">Cargando mapa...</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';
  
  const props = defineProps({
    items: Array, // List of items (clients or warehouses)
    focusedItem: Object, // The item to focus on
    itemType: String // Type of items ('clientes' or 'almacenes')
  });
  
  const map = ref(null);
  const mapContainer = ref(null);
  const isMapLoaded = ref(false);
  const selectedItemId = ref(null);
  let markers = [];
  
  const addMarker = ({ name, coordinates, description }) => {
    const marker = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${name}</h3><p>${description}</p>`))
      .addTo(map.value);
    markers.push(marker);
  };
  
  const removeAllMarkers = () => {
    markers.forEach(marker => marker.remove());
    markers = [];
  };
  
  const addAllItemMarkers = () => {
    removeAllMarkers();
    props.items.forEach(item => {
      const coordinates = item.longitud && item.latitud ? [item.longitud, item.latitud] : null;
      if (coordinates) {
        addMarker({ 
          name: item.nombre, 
          coordinates, 
          description: `${props.itemType === 'clientes' ? 'Dirección' : 'Posición'} de ${item.nombre}` 
        });
      }
    });
  };
  
  const focusOnItem = () => {
    const item = props.items.find(i => i.id === parseInt(selectedItemId.value));
    if (item && item.longitud && item.latitud) {
      map.value.flyTo({
        center: [item.longitud, item.latitud],
        zoom: 17,
        speed: 1.5,
        curve: 1.2,
        essential: true
      });
    }
  };
  
  onMounted(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY29zaW9iaXQiLCJhIjoiY200Z2J3dm93MWh5bDJpcHo5cGtuNm82ZSJ9.d_Lwbr3pakpNua99XFK33g';
    map.value = new mapboxgl.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-70.64827, -33.45694],
      zoom: 12
    });
  
    map.value.on('load', () => {
      isMapLoaded.value = true;
      addAllItemMarkers();
    });
  });
  
  onUnmounted(() => {
    if (map.value) map.value.remove();
  });
  
  watch(() => props.focusedItem, (newItem) => {
    if (newItem && newItem.longitud && newItem.latitud) {
      map.value.flyTo({
        center: [newItem.longitud, newItem.latitud],
        zoom: 17,
        speed: 1.5,
        curve: 1.2,
        essential: true
      });
    }
  });
  </script>
  
  <style scoped>
  .map-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  .search-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  
  .search-dropdown {
    padding: 10px;
    font-size: 16px;
    border-radius: 8px;
    width: 100%;
  }
  
  .map-container {
    width: 100%;
    height: 400px;
  }
  
  .map-loading {
    text-align: center;
    padding: 20px;
  }
  </style>
  