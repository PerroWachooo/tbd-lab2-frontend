<!-- this component is temporal, it has various functions to use on the index-->

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
  
  // Use your Mapbox access token
  const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiY29zaW9iaXQiLCJhIjoiY200Z2J3dm93MWh5bDJpcHo5cGtuNm82ZSJ9.d_Lwbr3pakpNua99XFK33g'
  
  // Reactive references
  const map = ref(null)
  const mapContainer = ref(null)
  const isMapLoaded = ref(false)
  const locationQuery = ref('')
  const suggestions = ref([])
  const highlightedIndex = ref(-1)
  const markers = [] // Track all active markers for potential removal later
  
  // Initial predefined locations
  const locations = [
  { name: 'Arica y Parinacota - Morro de Arica', coordinates: [-70.3166, -18.4783], description: 'A historic landmark in Arica with panoramic views of the Pacific Ocean.' },
  { name: 'Tarapacá - Humberstone and Santa Laura Saltpeter Works', coordinates: [-69.8000, -20.2167], description: 'UNESCO World Heritage Site of former saltpeter works near Iquique.' },
  { name: 'Antofagasta - La Portada', coordinates: [-70.4432, -23.6524], description: 'A natural arch formation and popular tourist destination near Antofagasta.' },
  { name: 'Atacama - Bahía Inglesa', coordinates: [-70.6086, -27.0922], description: 'A beautiful beach destination known for its turquoise waters and white sands.' },
  { name: 'Coquimbo - Valle de Elqui', coordinates: [-70.0408, -29.9533], description: 'A scenic valley known for its vineyards, pisco production, and clear skies for stargazing.' },
  { name: 'Valparaíso - Valparaíso Historic Quarter', coordinates: [-71.6275, -33.0458], description: 'A UNESCO World Heritage Site featuring colorful houses and funiculars on steep hills.' },
  { name: 'Metropolitana - Plaza de Armas, Santiago', coordinates: [-70.6483, -33.4372], description: 'The central historic square in Santiago, surrounded by important landmarks.' },
  { name: 'O’Higgins - Sewell Mining Town', coordinates: [-70.3544, -34.0732], description: 'An abandoned mining town and UNESCO World Heritage Site in the Andes mountains.' },
  { name: 'Maule - Parque Nacional Radal Siete Tazas', coordinates: [-71.0780, -35.4314], description: 'A national park known for its waterfalls, natural pools, and hiking trails.' },
  { name: 'Ñuble - Termas de Chillán', coordinates: [-71.4656, -36.8988], description: 'A popular ski and thermal bath resort in the Andes mountains.' },
  { name: 'Biobío - Parque Pedro del Río Zañartu', coordinates: [-73.0915, -36.8053], description: 'A large nature reserve and park with trails, a museum, and views of the Pacific Ocean.' },
  { name: 'Araucanía - Volcán Villarrica', coordinates: [-72.1229, -39.4228], description: 'A snow-capped volcano near Pucón, known for hiking, skiing, and adventure tourism.' },
  { name: 'Los Ríos - Valdivia Riverfront', coordinates: [-73.2466, -39.8172], description: 'A scenic waterfront in Valdivia, known for its fish market, sea lions, and river cruises.' },
  { name: 'Los Lagos - Chiloé Island, Castro Palafitos', coordinates: [-73.7677, -42.4807], description: 'The iconic stilt houses on Chiloé Island, famous for their colorful appearance.' },
  { name: 'Aysén - Capillas de Mármol (Marble Caves)', coordinates: [-72.6822, -46.6529], description: 'Spectacular natural caves formed in marble on Lake General Carrera.' },
  { name: 'Magallanes - Torres del Paine', coordinates: [-73.0562, -51.2610], description: 'A world-renowned national park known for its granite peaks, glaciers, and trekking routes.' }
];
  // Function to add a single marker
  const addMarker = ({ name, coordinates, description }) => {
    if (!map.value) return
  
    const marker = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) 
          .setHTML(`<h3>${name}</h3><p>${description}</p>`)
      )
      .addTo(map.value)
  
    markers.push(marker)
  }
  
  // Function to add all predefined markers
  const addMarkers = () => {
    locations.forEach(location => addMarker(location))
  }
  
  // Remove all existing markers
  const removeAllMarkers = () => {
    markers.forEach(marker => marker.remove())
    markers.length = 0 // Clear marker list
  }
  
  // Function to fetch suggestions from Mapbox Geocoding API
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
  
  // Function to select a suggestion and fly to it
  const selectSuggestion = (suggestion) => {
    const [lon, lat] = suggestion.geometry.coordinates
    locationQuery.value = suggestion.place_name
  
    map.value.flyTo({
      center: [lon, lat],
      zoom: 17,
      speed: 1.5,
      curve: 1.2,
      essential: true
    })
  
    map.value.once('moveend', () => {
      removeAllMarkers()
      addMarker({ name: suggestion.place_name, coordinates: [lon, lat], description: 'Search result' })
    })
  
    suggestions.value = [] 
  }
  
  // Functions for handling keyboard navigation in the suggestions dropdown
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
  
  // Initialize the Mapbox map
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
      addMarkers()
    })
  }
  
  const cleanupMap = () => {
    if (map.value) {
      removeAllMarkers()
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
  