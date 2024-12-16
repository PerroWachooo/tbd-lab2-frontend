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

      <v-btn @click="selectClosestAlmacen" class="mt-2" color="primary">
        Seleccionar Almacén Más Cercano
      </v-btn>

      <h3>Elegir Almacén</h3>
      <v-select
        ref="almacenSelect"
        clearable
        label="Seleccionar Almacén"
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
    try {
      this.refreshToken = localStorage.getItem('refresh_token') || '';
      if (!this.refreshToken) {
        console.warn('refresh_token not found in localStorage, defaulting to an empty string.');
      }
    } catch (error) {
      console.error('Error accessing localStorage for refreshToken:', error);
      this.refreshToken = '';
    }
    
    try {
      const idUsuario = localStorage.getItem('id_usuario');
      this.id_usuario = idUsuario && !isNaN(parseInt(idUsuario, 10)) ? parseInt(idUsuario, 10) : null;
      if (this.id_usuario === null) {
        console.warn('id_usuario is not a valid number or not found in localStorage.');
      }
    } catch (error) {
      console.error('Error accessing localStorage for id_usuario:', error);
      this.id_usuario = null;
    }
    
    this.fetchClientes();
    this.fetchAlmacenes();
    this.$nextTick(() => {
      this.initMap();
    });
  },
  watch: {
    clienteSelected: async function (newCliente) {
      if (newCliente && newCliente.direccion) {
        const coordenadas = await this.geocodeAddress(newCliente.direccion);
        if (coordenadas.longitud !== null && coordenadas.latitud !== null) {
          this.$set(this.clienteSelected, 'longitud', coordenadas.longitud);
          this.$set(this.clienteSelected, 'latitud', coordenadas.latitud);
        }
        this.updateMapMarkers();
      }
    },
    almacenSelected: function () {
      this.updateMapMarkers();
    }
  },
  methods: {
    async fetchClientes() {
      try {
        const { getAllClientes } = useClienteService();
        this.clientes = await getAllClientes();
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    },
    async fetchAlmacenes() {
      try {
        const { obtenerAlmacenes } = useAlmacenService();
        this.almacenes = await obtenerAlmacenes();
      } catch (error) {
        console.error('Error al obtener los almacenes:', error);
      }
    },
    async selectClosestAlmacen() {
      try {
        if (!this.clienteSelected) return;
        const { cercanoCliente } = useClienteService();
        const almacenMasCercano = await cercanoCliente(this.clienteSelected.id_cliente);
        if (almacenMasCercano) {
          this.almacenSelected = almacenMasCercano;
          this.$nextTick(() => {
            if (this.$refs.almacenSelect) {
              this.$refs.almacenSelect.internalValue = almacenMasCercano;
              this.$refs.almacenSelect.$emit('change', almacenMasCercano);
            }
          });
        }
      } catch (error) {
        console.error('Error al seleccionar el almacén más cercano:', error);
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
      this.map.on('remove', () => {
        this.map.off('load');
      });
    },
    async geocodeAddress(direccion) {
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(direccion)}.json?access_token=${mapboxgl.accessToken}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const [longitud, latitud] = data.features[0].geometry.coordinates;
          if (!isNaN(longitud) && !isNaN(latitud)) {
            return { longitud, latitud };
          }
        }
        return { longitud: null, latitud: null };
      } catch (error) {
        console.error('Error during geocoding request:', error);
        return { longitud: null, latitud: null };
      }
    },
  }
};
</script>
