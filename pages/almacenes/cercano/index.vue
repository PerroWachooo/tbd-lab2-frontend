<template>
  <Header />

  <div class="background">
    <h1 class="lexend-deca-title">ALMACENES MÁS CERCANOS</h1>

    <div class="boton-clientes">

      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn v-bind="props" color="var(--primary-a20)" class="boton-chico">
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

    <div v-if="focusedClient" class="cliente-detalle">
      <h2>Detalles del Cliente</h2>
      <p><strong>Nombre:</strong> {{ focusedClient.nombre }}</p>
      <p><strong>Dirección:</strong> {{ focusedClient.direccion }}</p>
      <p><strong>Email:</strong> {{ focusedClient.email }}</p>
      <p><strong>Teléfono:</strong> {{ focusedClient.telefono }}</p>
    </div>
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
      clientes: [],
      loading: true,
      focusedClient: null,
      dialogEditar: false,
      dialogCrear: false
    };
  },
  mounted() {
    this.fetchClientes();
  },
  methods: {
    async fetchClientes() {
      this.loading = true;
      try {
        const { getAllClientes } = useClienteService();
        this.clientes = await getAllClientes();
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
    },
    irAAñadir() {
      this.dialogCrear = true;
    }
  }
};
</script>
<style scoped>
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
  width: 150px;
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
