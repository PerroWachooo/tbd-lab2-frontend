<template>
  <Header />

  <div class="background">
    <h1 class="lexend-deca-title">ALMACENES MÁS CERCANOS</h1>

    <v-card
			class="mx-auto pa-12 pb-8 mt-16 position-relative"
			elevation="8"
			max-width="800"
			min-height="500"
			rounded="lg"
			color="var(--primary-a20)"
      variant="tonal"
		>
    Elegir Clientes
    <v-select
      clearable
      label="Seleccionar"
      :items="clientes"
      item-title="nombre"
      variant="outlined"
      v-model="clienteSelected"
    ></v-select>
    <br>
    Elegir almacen
    <v-select
      clearable
      label="Seleccionar"
      :items="almacenes"
      item-title="nombre"
      variant="outlined"
      v-model="almacenSelected"
    ></v-select>

    <v-card
			class="mx-auto pa-12 pb-8 mt-16 position-relative"
			elevation="8"
			max-width="600"
			min-height="200"
			rounded="lg"
			color="var(--primary-a20)"
      variant="tonal"
		> 
    <v-card-title class="text-overline text-h1 font-weight-bold">

        Distanca de Ruta Corta:
        <br><br><br>
      </v-card-title>
      <div class="text-purple-darken-3 text-h3 font-weight-bold d-flex justify-center">{{ distancia }}</div>
  
    </v-card>



  </v-card>


    
</div>

  
</template>

<script>
import { useRouter } from "vue-router";
import { useClienteService } from "~/services/clienteService";
import { useAlmacenService } from "~/services/almacenService";

import Header from "@/components/Header.vue";

export default {
  name: "Clientes",
  components: { Header },
  data() {
    return {
      newCliente: { nombre: '', direccion: '', email: '', telefono: '', posicion: "0.0", longitud:"0.0", latitud:"0.0" },
      clienteAEditar: { nombre: '', direccion: '', email: '', telefono: '', posicion: "0.0", longitud:"0.0", latitud:"0.0" },
      almacenes: [],
      clientes: [],
      loading: true,
      focusedClient: null,
      dialogEditar: false,
      dialogCrear: false,
      ClienteSelected: null,
      almacenSelected: null,
      distancia: 150,
    };
  },
  mounted() {
    this.fetchClientes();
    this.fetchAlmacenes();
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
    async fetchAlmacenes() {
      this.loading = true;
      try {
        const { obtenerAlmacenes } = useAlmacenService();
        this.almacenes = await obtenerAlmacenes();
      } catch (error) {
        console.error('Error al obtener los almacenes:', error);
      } finally {
        this.loading = false;
      }
      console.log(this.almacenes); 
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
