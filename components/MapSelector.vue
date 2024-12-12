<template>
  <div class="map-page">
    <!-- Location Dropdown 1 -->
    <div class="location-picker-container">
      <h2>Pick Location 1</h2>
      <select v-model="selectedLocationIndex1" @change="handleLocationChange" class="location-dropdown">
        <option v-for="(location, index) in locations" :key="'loc1-' + index" :value="index">
          {{ location.name }}
        </option>
      </select>
    </div>

    <!-- Location Search for Location 2 -->
    <div class="search-container">
      <h2>Pick Location 2</h2>
      <input 
        v-model="locationQuery" 
        @input="fetchSuggestions"
        @keydown.down.prevent="moveDown"
        @keydown.up.prevent="moveUp"
        @keydown.enter.prevent="selectHighlightedSuggestion"
        placeholder="Search for a location (e.g., New York, NY)"
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
      <div v-if="!isMapLoaded" class="map-loading">Loading map...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import axios from 'axios'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiY29zaW9iaXQiLCJhIjoiY200Z2J3dm93MWh5bDJpcHo5cGtuNm82ZSJ9.d_Lwbr3pakpNua99XFK33g'

const map = ref(null)
const mapContainer = ref(null)
const isMapLoaded = ref(false)
const selectedLocationIndex1 = ref(null)
const locationQuery = ref('')
const suggestions = ref([])
const highlightedIndex = ref(-1)
let currentMarker = null 
let routeLayerId = null 

const locations = [
  { name: 'Arica y Parinacota - Morro de Arica', coordinates: [-70.3166, -18.4783], description: 'A historic landmark in Arica with panoramic views of the Pacific Ocean.' },
  { name: 'Valparaíso - Valparaíso Historic Quarter', coordinates: [-71.6275, -33.0458], description: 'A UNESCO World Heritage Site featuring colorful houses and funiculars on steep hills.' }
]

const addMarker = ({ name, coordinates, description }) => {
  if (!map.value) return
  const marker = new mapboxgl.Marker()
    .setLngLat(coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }) 
        .setHTML(`<h3>${name}</h3><p>${description}</p>`)
    )
    .addTo(map.value)
}

const focusOnLocation = (index) => {
  if (!map.value) return
  const location = locations[index]
  const [lon, lat] = location.coordinates
  map.value.flyTo({
    center: [lon, lat],
    zoom: 15,
    speed: 1.5,
    curve: 1.2,
    essential: true
  })
}

const handleLocationChange = () => {
  const selectedIndex = selectedLocationIndex1.value
  if (selectedIndex !== null) {
    const location = locations[selectedIndex]
    addMarker(location)
    focusOnLocation(selectedIndex)
  }
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
  locationQuery.value = suggestion.place_name
  addMarker({ name: suggestion.place_name, coordinates: [lon, lat], description: 'Selected location' })
  calculateRoute(lon, lat)
  suggestions.value = []
}

const calculateRoute = async (destinationLon, destinationLat) => {
  const selectedIndex = selectedLocationIndex1.value
  if (selectedIndex === null) return

  const startLocation = locations[selectedIndex].coordinates
  const startCoordinates = `${startLocation[0]},${startLocation[1]}`
  const endCoordinates = `${destinationLon},${destinationLat}`
  try {
    const response = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoordinates};${endCoordinates}`,
      {
        params: {
          access_token: MAPBOX_ACCESS_TOKEN,
          geometries: 'geojson'
        }
      }
    )
    const routeData = response.data.routes[0].geometry
    drawRoute(routeData)
  } catch (error) {
    console.error('Error calculating route:', error)
  }
}

const drawRoute = (geometry) => {
  if (!map.value) return
  if (map.value.getSource('route')) {
    map.value.getSource('route').setData(geometry)
  } else {
    map.value.addSource('route', {
      type: 'geojson',
      data: geometry
    })
    map.value.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#0074D9',
        'line-width': 4
      }
    })
  }
}

onMounted(() => {
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
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
    map.value = null
  }
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

.location-picker-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.location-picker-container h2 {
  margin-bottom: 10px;
  font-size: 18px;
}

.location-dropdown {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f4f4f4;
}

.map-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: 8px;
  border: 1px solid #ccc;
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
