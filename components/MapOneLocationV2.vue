<template>
    <div class="map-page">
      <!-- Search Bar -->
      <div class="search-container">
        <input 
          v-model="locationQuery" 
          @input="fetchSuggestions"
          @keydown.down.prevent="moveDown"
          @keydown.up.prevent="moveUp"
          @keydown.enter.prevent="selectHighlightedSuggestion"
          placeholder="Busca tu dirección para añadirla"
          class="search-input"
        />
        <ul v-if="suggestions.length" class="suggestions-dropdown">
          <li 
            v-for="(suggestion, index) in suggestions" 
            :key="index" 
            @click="selectSuggestion(suggestion)"
            :class="{ highlighted: index === highlightedIndex }"
          >
            {{ suggestion.place_name }}
          </li>
        </ul>
      </div>
  
      <!-- Map Container -->
      <div ref="mapContainer" class="map-container" role="region" aria-label="Interactive map">
        <div v-if="!isMapLoaded" class="map-loading">Cargando mapa...</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import mapboxgl from 'mapbox-gl'
  import axios from 'axios'
  import 'mapbox-gl/dist/mapbox-gl.css'
  
  const emit = defineEmits(['location-selected']) 
  
  const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiY29zaW9iaXQiLCJhIjoiY200Z2J3dm93MWh5bDJpcHo5cGtuNm82ZSJ9.d_Lwbr3pakpNua99XFK33g'
  
  const map = ref(null)
  const mapContainer = ref(null)
  const isMapLoaded = ref(false)
  const locationQuery = ref('')
  const suggestions = ref([]) // Declaración correcta de la variable
  const highlightedIndex = ref(-1)
  let currentMarker = null 
  
  const addMarker = ({ name, coordinates }) => {
    if (!map.value) return
  
    if (currentMarker) {
      currentMarker.remove()
    }
  
    currentMarker = new mapboxgl.Marker({ draggable: true })
      .setLngLat(coordinates)
      .addTo(map.value)
  
    currentMarker.on('dragend', () => {
      const newCoordinates = currentMarker.getLngLat()
      emit('location-selected', {
        position: name,
        lat: newCoordinates.lat,
        lon: newCoordinates.lng
      })
    })
  }
  
  const fetchSuggestions = async () => {
    if (!locationQuery.value) {
      suggestions.value = []
      return
    }
  
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationQuery.value)}.json`,
        {
          params: {
            access_token: MAPBOX_ACCESS_TOKEN,
            autocomplete: true,
            limit: 5
          }
        }
      )
      suggestions.value = response.data.features
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }
  
  const selectSuggestion = (suggestion) => {
  const [lon, lat] = suggestion.geometry.coordinates
  
  // Emitir el evento con los datos de posición, latitud y longitud
 emit('location-selected', {
  position: suggestion.place_name,
  lat,
  lon
});
console.log('Datos emitidos:', {
  position: suggestion.place_name,
  lat,
  lon
});

  // Otras acciones para mover el mapa y agregar marcador
  map.value.flyTo({
    center: [lon, lat],
    zoom: 17,
    speed: 1.5,
    curve: 1.2,
    essential: true
  });

  map.value.once('moveend', () => {
    addMarker({ name: suggestion.place_name, coordinates: [lon, lat] })
  });

  suggestions.value = [];
}

  
  const moveUp = () => {
    if (highlightedIndex.value > 0) {
      highlightedIndex.value -= 1
    }
  }
  
  const moveDown = () => {
    if (highlightedIndex.value < suggestions.value.length - 1) {
      highlightedIndex.value += 1
    }
  }
  
  const selectHighlightedSuggestion = () => {
    if (highlightedIndex.value !== -1) {
      selectSuggestion(suggestions.value[highlightedIndex.value])
    }
  }
  
  const initializeMap = () => {
    if (!mapContainer.value) return
  
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN
  
    map.value = new mapboxgl.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.006, 40.7128],
      zoom: 12
    })
  
    map.value.on('load', () => {
      isMapLoaded.value = true
    })
  }
  
  const cleanupMap = () => {
    if (map.value) {
      if (currentMarker) {
        currentMarker.remove()
      }
      map.value.remove()
      map.value = null
    }
  }
  
  onMounted(() => {
    initializeMap()
  })
  
  onUnmounted(() => {
    cleanupMap()
  })
  </script>
  
  <style scoped>
  .map-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  .search-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    margin-bottom: 20px;
    width: 300px;
  }
  
  .search-input {
    width: 100%;
    padding: 10px 15px;
    border-radius: 20px;
    font-size: 14px;
    margin-bottom: 10px;
  }
  
  .suggestions-dropdown {
    width: 100%;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    list-style: none;
    max-height: 150px;
    overflow-y: auto;
    padding: 0;
  }
  
  .suggestions-dropdown li {
    padding: 8px 15px;
    cursor: pointer;
  }
  
  .suggestions-dropdown li.highlighted {
    background-color: #007aff;
    color: white;
  }
  
  .map-container {
    width: 100%;
    height: 100%;
    min-height: 400px;
  }
  
  .map-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    color: #555;
    font-weight: bold;
  }
  </style>
  