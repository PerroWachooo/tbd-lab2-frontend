<template>
  <Header />

  <div class="background">
    <h1 class="lexend-deca-title">ALMACENES MÁS CERCANOS</h1>

    <div class="boton-clientes">
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" color="var(--primary-a20)" class="boton-chico" variant="tonal">
            Lista de clientes
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="cliente in clientes"
            :key="cliente.id_cliente"
            @click="toggleClientFocus(cliente)"
          >
            <v-list-item-title>{{ cliente.nombre }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <v-container>
      <v-row>
        <v-col>
          <v-card v-if="focusedClient" title="Detalles del cliente" variant="tonal" color="var(--primary-a0)">
            <v-card-text>
              <p><strong>Nombre:</strong> {{ focusedClient.nombre }}</p>
              <p><strong>Dirección:</strong> {{ focusedClient.direccion }}</p>
              <p><strong>Email:</strong> {{ focusedClient.email }}</p>
              <p><strong>Teléfono:</strong> {{ focusedClient.telefono }}</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card v-if="almacen.nombre" title="Almacén más cercano" variant="tonal" color="var(--primary-a0)">
            <v-card-text>
              <p><strong>Nombre:</strong> {{ almacen.nombre }}</p>
              <p><strong>Posición:</strong> {{ almacen.posicion }}</p>
              <p><strong>Longitud:</strong> {{ almacen.longitud }}</p>
              <p><strong>Latitud:</strong> {{ almacen.latitud }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container>
      <v-card  variant="tonal" color="var(--primary-a0)"> 
        <v-card-title class="d-flex ">Mapa</v-card-title>
        <v-card-text>
          <div class="map-container">
            <MapSelect ref="mapComponent" :clients="clientes" :focusedClient="focusedClient" />
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useClienteService } from "~/services/clienteService";

import Header from "@/components/Header.vue";

export default {
  name: "Clientes",
  components: { Header },
  data() {
    return {
      newCliente: { nombre: '', direccion: '', email: '', telefono: '', posicion: "0.0", longitud:"0.0", latitud:"0.0" },
      clienteAEditar: { nombre: '', direccion: '', email: '', telefono: '', posicion: "0.0", longitud:"0.0", latitud:"0.0" },
      almacen:{ nombre: '', posicion: '', longitud: '', latitud: ''},
      clientes: [],
      loading: true,
      focusedClient: null,
      dialogEditar: false,
      dialogCrear: false
    };
  },
  mounted() {
    this.fetchClientes();
    this.fetchAlmacenMasCercano();
  },
  methods: {
    async fetchClientes() {
      this.loading = true;
      try {
        const { getAllClientes } = useClienteService();
        this.clientes = await getAllClientes();
        console.log('Clientes obtenidos:', this.clientes);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      } finally {
        this.loading = false;
      }
    },
    editarCliente(cliente) {
      this.clienteAEditar = { ...cliente };
      this.dialogEditar = true;
    },
    async deleteCliente(id_cliente) {
      const isConfirmed = window.confirm("¿Estás seguro de eliminar el cliente?");
      if (!isConfirmed) return;
      try {
        const clienteService = useClienteService();
        await clienteService.deleteCliente(id_cliente);
        this.clientes = this.clientes.filter(cliente => cliente.id_cliente !== id_cliente);
      } catch (error) {
        console.error('Error al eliminar el cliente:', error);
      }
    },
    toggleClientFocus(cliente) {
      this.focusedClient = this.focusedClient?.id_cliente === cliente.id_cliente ? null : cliente;
      this.fetchAlmacenMasCercano(cliente.id_cliente);
    },
    async fetchAlmacenMasCercano(id_cliente) {
      try {
        const { cercanoCliente } = useClienteService();
        const almacen = await cercanoCliente(id_cliente);
        this.almacen = almacen;
      } catch (error) {
        console.error('Error al obtener el almacén más cercano:', error);
      }
    },
    irAAñadir() {
      this.dialogCrear = true;
    }
  }
};
</script>
<style scoped>
.background {
  background-color: #282828;
  min-height: 100vh;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
header h1 {
  margin-left: 20px;
  margin-top: 20px;
  font-size: 2.25rem;
  font-weight: bold;
  text-transform: uppercase;
}

.lexend-deca-title {
  font-family: "Lexend Deca", sans-serif;
  font-optical-sizing: auto;
  color: var(--primary-a0);
  font-weight: 700;
  font-size: 4.25rem;
  font-style: normal;
}
.background {
  padding: 20px;
}

.lexend-deca-title {
  font-family: 'Lexend Deca', sans-serif;
}

.boton-clientes {
  margin-bottom: 20px;
}

.boton-chico {
  width: 300px;
}

.map-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.v-card {
  margin-bottom: 20px;
}
</style>
