<template> 
    <div class="map-page">
      <!-- Contenedor del Mapa -->
      <div ref="mapContainer" class="map-container" role="region" aria-label="Mapa interactivo">
        <div v-if="!isMapLoaded" class="map-loading">Cargando mapa...</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import mapboxgl from 'mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css'
  
  const props = defineProps({
    direccionCliente: String,
    direccionAlmacen: Object // { longitud, latitud }
  })
  
  const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiY29zaW9iaXQiLCJhIjoiY200Z2J3dm93MWh5bDJpcHo5cGtuNm82ZSJ9.d_Lwbr3pakpNua99XFK33g'
  const map = ref(null)
  const mapContainer = ref(null)
  const isMapLoaded = ref(false)
  
  let currentMarkers = []
  let currentSources = []
  
  // Limpiar todos los marcadores, capas y fuentes
  const clearMap = () => {
    currentMarkers.forEach(marker => marker.remove())
    currentMarkers = []
  
    currentSources.forEach(sourceId => {
      if (map.value.getLayer(sourceId)) map.value.removeLayer(sourceId)
      if (map.value.getSource(sourceId)) map.value.removeSource(sourceId)
    })
    currentSources = []
  }
  
  // Agregar marcador al mapa y ajustar la vista
  const addMarker = ({ nombre, longitud, latitud }) => {
    const marker = new mapboxgl.Marker()
      .setLngLat([longitud, latitud])
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${nombre}</h3>`))
      .addTo(map.value)
  
    currentMarkers.push(marker)
    return [longitud, latitud]
  }
  
  // Geocodificación de la dirección del cliente
  const geocodeAddress = async (address) => {
  if (!address || typeof address !== 'string') {
    console.warn("Dirección inválida para geocodificación:", address);
    return null;
  }
  try {
    console.log('Geocodificando dirección:', address);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      console.log('Coordenadas obtenidas:', { longitude, latitude });
      return { longitud: longitude, latitud: latitude, nombre: address };
    }
    console.warn('No se encontraron coordenadas para:', address);
    return null;
  } catch (error) {
    console.error('Error al geocodificar la dirección:', error);
    return null;
  }
};

  
  // Ajustar vista del mapa a los dos puntos
  const fitToBounds = (coords) => {
    map.value.fitBounds(coords, { padding: 50, duration: 1000 })
  }
  
  // Ver cambios en cliente y almacén
  watch([() => props.direccionCliente, () => props.direccionAlmacen], async ([direccionCliente, almacen]) => {
    if (!direccionCliente || !almacen || !almacen.longitud || !almacen.latitud) return
  
    clearMap()
  
    // Obtener coordenadas del cliente
    const clienteCoords = await geocodeAddress(direccionCliente)
    const almacenCoords = { 
      longitud: parseFloat(almacen.longitud), 
      latitud: parseFloat(almacen.latitud), 
      nombre: 'Almacén' 
    }
  
    if (clienteCoords && almacenCoords) {
      const coords = [
        addMarker(clienteCoords), 
        addMarker(almacenCoords)
      ]
  
      fitToBounds(coords)
      console.log('Cliente:', clienteCoords, 'Almacén:', almacenCoords)
    }
  })
  
  onMounted(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN
    map.value = new mapboxgl.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 2
    })
    map.value.on('load', () => {
      isMapLoaded.value = true
    })
  })
  
  onUnmounted(() => {
    if (map.value) map.value.remove()
  })
  </script>
  
  <style scoped>
  .map-container {
    width: 100%;
    height: 100%;
    min-height: 400px;
  }
  </style>
  