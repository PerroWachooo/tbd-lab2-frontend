<template>
  <div class="background">
    <Header />
    <h1 class="lexend-deca-title">CLIENTES</h1>

    <!-- Use the new MapSelect component -->
    <MapSelect ref="mapComponent" :clients="clientes" :focusedClient="focusedClient" />

    <v-container>
      <v-row>
        <v-col v-for="cliente in clientes" :key="cliente.id_cliente" cols="12" sm="6" md="4">
          <v-card :title="cliente.nombre" variant="tonal" color="var(--primary-a0)">
            <v-card-subtitle>Contacto:</v-card-subtitle>
            <v-card-text>
              {{ cliente.email }} <br>
              {{ cliente.telefono }} <br>
              {{ cliente.direccion }}
            </v-card-text>
            <v-card-actions>
              <v-btn icon @click="toggleClientFocus(cliente)">
                <v-icon>{{ isSelected(cliente) ? 'mdi-checkbox-marked-circle' : 'mdi-checkbox-blank-circle-outline' }}</v-icon> 
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import MapSelect from "~/components/MapSelect.vue"; // Updated from MapSelector to MapSelect
import { useClienteService } from "~/services/clienteService";

export default {
  name: "MapClient",
  components: {
    Header,
    MapSelect // Updated from MapSelector to MapSelect
  },
  data() {
    return {
      clientes: [],
      focusedClient: null
    };
  },
  mounted() {
    this.fetchClientes();
  },
  methods: {
    async fetchClientes() {
      try {
        const { getAllClientes } = useClienteService();
        const response = await getAllClientes();
        this.clientes = response;
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    },
    toggleClientFocus(cliente) {
      if (this.focusedClient && this.focusedClient.id_cliente === cliente.id_cliente) {
        this.focusedClient = null
      } else {
        this.focusedClient = cliente
      }
    },
    isSelected(cliente) {
      return this.focusedClient && this.focusedClient.id_cliente === cliente.id_cliente
    }
  }
}
</script>
