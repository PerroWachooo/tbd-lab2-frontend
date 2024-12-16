<template>
  <Header />

  <div class="background">
    <h1 class="lexend-deca-title">Ruta</h1>

    <v-card
      class="mx-auto pa-12 pb-8 mt-16 position-relative"
      elevation="8"
      max-width="800"
      min-height="500"
      rounded="lg"
      color="var(--primary-a20)"
      variant="tonal"
    >
      <h3>Elegir Cliente</h3>
      <v-select
        clearable
        label="Seleccionar"
        :items="clientes"
        item-title="nombre"
        variant="outlined"
        v-model="clienteSelected"
        return-object
      ></v-select>
      <v-btn @click="selectClosestAlmacen" class="mt-2" color="primary">Seleccionar Almacén Más Cercano</v-btn>

      <h3>Elegir Almacén</h3>
      <v-select
        clearable
        label="Seleccionar"
        :items="almacenes"
        item-title="nombre"
        variant="outlined"
        v-model="almacenSelected"
        return-object
      ></v-select>

      <div class="map-page">
        <div v-if="!isMapLoaded" class="map-loading">Cargando mapa...</div>
        <div ref="mapContainer" class="map-container" role="region" aria-label="Mapa interactivo"></div>
      </div>
    </v-card>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useClienteService } from "~/services/clienteService";
import { useAlmacenService } from "~/services/almacenService";

export default {
  name: "Clientes",
  components: { Header },
  data() {
    return {
      clientes: [],
      almacenes: [],
      clienteSelected: null,
      almacenSelected: null,
      distancia: null,
      refreshToken: null,
      id_usuario: null,
      map: null,
      isMapLoaded: false,
      currentMarkers: []
    };
  },
  mounted() {
    console.log('🚀 Componente montado');
    this.refreshToken = localStorage.getItem('refresh_token');
    console.log('🔑 Token de sesión:', this.refreshToken);
    this.id_usuario = parseInt(localStorage.getItem('id_usuario'), 10);
    console.log('👤 ID de usuario:', this.id_usuario);
    this.fetchClientes();
    this.fetchAlmacenes();
    this.$nextTick(() => {
      this.initMap();
    });
  },
  watch: {
    clienteSelected: async function (newCliente) {
      console.log('📌 Cliente seleccionado:', newCliente);
      if (newCliente && newCliente.direccion) {
        const coordenadas = await this.geocodeAddress(newCliente.direccion);
        this.clienteSelected.longitud = coordenadas.longitud;
        this.clienteSelected.latitud = coordenadas.latitud;
        this.updateMapMarkers();
      }
    },
    almacenSelected: function () {
      console.log('📌 Almacén seleccionado:', this.almacenSelected);
      this.updateMapMarkers();
    }
  },
  methods: {
    async fetchClientes() {
      try {
        console.log('📥 Cargando lista de clientes...');
        const { getAllClientes } = useClienteService();
        this.clientes = await getAllClientes();
        console.log('✅ Clientes cargados:', this.clientes);
      } catch (error) {
        console.error('❌ Error al obtener los clientes:', error);
      }
    },
    async fetchAlmacenes() {
      try {
        console.log('📥 Cargando lista de almacenes...');
        const { obtenerAlmacenes } = useAlmacenService();
        this.almacenes = await obtenerAlmacenes();
        console.log('✅ Almacenes cargados:', this.almacenes);
      } catch (error) {
        console.error('❌ Error al obtener los almacenes:', error);
      }
    },
    async selectClosestAlmacen() {
      try {
        if (!this.clienteSelected) {
          console.warn('⚠️ No se ha seleccionado un cliente.');
          return;
        }
        console.log('📡 Buscando almacén más cercano para el cliente...');
        const { cercanoCliente } = useClienteService();
        const almacenMasCercano = await cercanoCliente(this.clienteSelected.id_cliente);
        this.almacenSelected = almacenMasCercano;
        console.log('🏠 Almacén más cercano seleccionado:', almacenMasCercano);
      } catch (error) {
        console.error('❌ Error al seleccionar el almacén más cercano:', error);
      }
    },
    initMap() {
      mapboxgl.accessToken = 'pk.eyJ1IjoiY29zaW9iaXQiLCJhIjoiY200Z2J3dm93MWh5bDJpcHo5cGtuNm82ZSJ9.d_Lwbr3pakpNua99XFK33g';
      this.map = new mapboxgl.Map({
        container: this.$refs.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-70.64827, -33.45694], 
        zoom: 10,
      });
      this.map.on('load', () => {
        this.isMapLoaded = true;
      });
    },
    async geocodeAddress(direccion) {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(direccion)}.json?access_token=pk.eyJ1IjoiY29zaW9iaXQiLCJhIjoiY200Z2J3dm93MWh5bDJpcHo5cGtuNm82ZSJ9.d_Lwbr3pakpNua99XFK33g`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [longitud, latitud] = data.features[0].geometry.coordinates;
      console.log(`📍 Coordenadas obtenidas para la dirección "${direccion}":`, { longitud, latitud });
      return { longitud, latitud };
    } else {
      console.warn(`⚠️ No se encontraron coordenadas para la dirección: "${direccion}"`);
      return { longitud: null, latitud: null };
    }
  } catch (error) {
    console.error('❌ Error al geocodificar la dirección:', error);
    return { longitud: null, latitud: null };
  }
},

    addMarker({ nombre, longitud, latitud }) {
      if (!isNaN(longitud) && !isNaN(latitud)) {
        console.log(`📍 Añadiendo marcador para ${nombre} en [${longitud}, ${latitud}]`);
        const marker = new mapboxgl.Marker()
          .setLngLat([longitud, latitud])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${nombre}</h3>`))
          .addTo(this.map);
        this.currentMarkers.push(marker);
        return [longitud, latitud];
      } else {
        console.warn('❌ Coordenadas inválidas:', { nombre, longitud, latitud });
      }
    },
    clearMap() {
      console.log('🧹 Limpiando todos los marcadores del mapa...');
      this.currentMarkers.forEach(marker => marker.remove());
      this.currentMarkers = [];
    },
  
  
    async updateMapMarkers() {
  if (!this.isMapLoaded || !this.clienteSelected || !this.almacenSelected) {
    console.warn('⚠️ No se puede actualizar los marcadores porque el mapa no está listo o faltan selecciones.');
    return;
  }

  console.log('🔄 Actualizando marcadores en el mapa...');
  this.clearMap();

  const clienteCoords = [parseFloat(this.clienteSelected.longitud), parseFloat(this.clienteSelected.latitud)];
  const almacenCoords = [parseFloat(this.almacenSelected.longitud), parseFloat(this.almacenSelected.latitud)];

  if (clienteCoords[0] && clienteCoords[1]) {
    this.addMarker({
      nombre: this.clienteSelected.nombre,
      longitud: clienteCoords[0], 
      latitud: clienteCoords[1]
    });
  }
 
  
  if (almacenCoords[0] && almacenCoords[1]) {
    this.addMarker({
      nombre: this.almacenSelected.nombre,
      longitud: almacenCoords[0], 
      latitud: almacenCoords[1]
    });
  }

  // Dibujar la línea recta punteada
  this.addDashedLine(clienteCoords, almacenCoords);

  // Obtener la ruta de calles y dibujarla
  const route = await this.getDrivingRoute(clienteCoords, almacenCoords);
  if (route.length > 0) {
    if (!this.map.getSource('driving-route')) {
      this.map.addSource('driving-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        }
      });

      this.map.addLayer({
        id: 'driving-route-layer',
        type: 'line',
        source: 'driving-route',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': '#007bff',
          'line-width': 4
        }
      });
    } else {
      this.map.getSource('driving-route').setData({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      });
    }

    // Volar para mostrar la ruta entera
    const allCoords = [clienteCoords, almacenCoords, ...route]; // Combinar cliente, almacén y puntos de la ruta
    const bounds = new mapboxgl.LngLatBounds();
    allCoords.forEach(coord => bounds.extend(coord));
    this.map.fitBounds(bounds, {
      padding: 50,
      duration: 2000,
      easing: (t) => t
    });
  } else {
    // Volar para mostrar solo la línea recta si no se obtuvo la ruta de calles
    this.map.fitBounds([clienteCoords, almacenCoords], {
      padding: 50,
      duration: 2000,
      easing: (t) => t
    });
  }
},


addDashedLine(origen, destino) {
  if (!this.map.getSource('dashed-line')) {
    this.map.addSource('dashed-line', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [origen, destino]
        }
      }
    });

    this.map.addLayer({
      id: 'dashed-line-layer',
      type: 'line',
      source: 'dashed-line',
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': '#ff0000',
        'line-width': 3,
        'line-dasharray': [2, 2] // Punteado
      }
    });
  } else {
    // Actualizar la línea con nuevos puntos
    this.map.getSource('dashed-line').setData({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [origen, destino]
      }
    });
  }
},

async getDrivingRoute(origen, destino) {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origen[0]},${origen[1]};${destino[0]},${destino[1]}?geometries=geojson&access_token=pk.eyJ1IjoiY29zaW9iaXQiLCJhIjoiY200Z2J3dm93MWh5bDJpcHo5cGtuNm82ZSJ9.d_Lwbr3pakpNua99XFK33g`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0].geometry.coordinates;
      console.log('🚗 Ruta de calles recibida:', route);
      return route;
    } else {
      console.warn('⚠️ No se encontró ninguna ruta entre los puntos');
      return [];
    }
  } catch (error) {
    console.error('❌ Error al obtener la ruta de calles:', error);
    return [];
  }
}

  }
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.map-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 20px;
  color: #666;
}
</style>
