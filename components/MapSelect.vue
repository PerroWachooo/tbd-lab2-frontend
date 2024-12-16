<template>
    <div class="map-page">
      <!-- Client Dropdown Toggle -->
      <div class="search-container">
        <select id="client-select" v-model="selectedClientId" @change="focusOnClient" class="search-dropdown">
        </select>
      </div>
  
      <!-- Map Container -->
      <div ref="mapContainer" class="map-container" role="region" aria-label="Interactive map">
        <div v-if="!isMapLoaded" class="map-loading">Loading map...</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import mapboxgl from 'mapbox-gl'
  import axios from 'axios'
  import 'mapbox-gl/dist/mapbox-gl.css'
  
  const props = defineProps({
    clients: Array, // Receive client data from parent
    focusedClient: Object // The client to focus on
  })
  
  const map = ref(null)
  const mapContainer = ref(null)
  const isMapLoaded = ref(false)
  const selectedClientId = ref(null)
  let markers = []
  const geocodeCache = {} // Cache for geocoded addresses
  
  const addMarker = ({ name, coordinates, description }) => {
    const marker = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${name}</h3><p>${description}</p>`))
      .addTo(map.value)
    markers.push(marker)
  }
  
  const removeAllMarkers = () => {
    markers.forEach(marker => marker.remove())
    markers = []
  }
  
  const geocodeAddress = async (address) => {
    if (geocodeCache[address]) {
      // If we have it in cache, return it
      return geocodeCache[address]
    }
    try {
      const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`, {
        params: {
          access_token: 'pk.eyJ1IjoiY29zaW9iaXQiLCJhIjoiY200Z2J3dm93MWh5bDJpcHo5cGtuNm82ZSJ9.d_Lwbr3pakpNua99XFK33g',
          limit: 1
        }
      })
      if (response.data.features.length > 0) {
        const coordinates = response.data.features[0].geometry.coordinates
        geocodeCache[address] = coordinates // Cache the result
        return coordinates
      } else {
        console.warn(`No coordinates found for address: ${address}`)
        return null
      }
    } catch (error) {
      console.error(`Error geocoding address: ${address}`, error)
      return null
    }
  }
  
  const addAllClientMarkers = async () => {
    removeAllMarkers()
    for (const client of props.clients) {
      const coordinates = await geocodeAddress(client.direccion)
      if (coordinates) {
        addMarker({ 
          name: client.nombre, 
          coordinates, 
          description: `Dirección de ${client.nombre}` 
        })
      }
    }
  }
  
  const focusOnClient = async () => {
    const client = props.clients.find(c => c.id_cliente === parseInt(selectedClientId.value))
    if (client) {
      const coordinates = await geocodeAddress(client.direccion)
      if (coordinates) {
        map.value.flyTo({
          center: coordinates,
          zoom: 17,
          speed: 1.5,
          curve: 1.2,
          essential: true
        })
      }
    }
  }
  
  onMounted(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY29zaW9iaXQiLCJhIjoiY200Z2J3dm93MWh5bDJpcHo5cGtuNm82ZSJ9.d_Lwbr3pakpNua99XFK33g'
    map.value = new mapboxgl.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-70.64827	,-33.45694	],
      zoom: 12
    })
  
    map.value.on('load', async () => {
      isMapLoaded.value = true
      await addAllClientMarkers()
    })
  })
  
  onUnmounted(() => {
    if (map.value) map.value.remove()
  })
  
  watch(() => props.focusedClient, async (newClient) => {
    if (newClient) {
      const coordinates = await geocodeAddress(newClient.direccion)
      if (coordinates) {
        map.value.flyTo({
          center: coordinates,
          zoom: 17,
          speed: 1.5,
          curve: 1.2,
          essential: true
        })
      }
    }
  })
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
  
  .search-label {
    font-weight: bold;
    margin-bottom: 5px;
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
  </style>
  