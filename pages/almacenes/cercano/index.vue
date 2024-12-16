<template>
  <Header />

  <div class="background">
    <h1 class="lexend-deca-title">CLIENTES Y ALMACENES</h1>

    <div class="map-container">
      <h2 class="lexend-deca-title">Mapa de Clientes</h2>
      <div class="search-container">
        <select 
          id="client-select" 
          v-model="focusedClientId" 
          @change="focusOnClient" 
          class="search-dropdown"
        >
          <option v-for="cliente in clientes" :key="cliente.id_cliente" :value="cliente.id_cliente">
            {{ cliente.nombre }}
          </option>
        </select>
        <v-btn 
          color="#e29818ff" 
          size="small" 
          variant="tonal" 
          class="boton-chico" 
          @click="findNearestWarehouse"
        >
          Encontrar Almacén Más Cercano
        </v-btn>
      </div>
      <MapSelect 
        ref="clientMapComponent" 
        :clients="clientes" 
        :focusedClient="focusedClient" 
        @item-selected="selectClient" 
      />
    </div>

    <div class="map-container">
      <h2 class="lexend-deca-title">Mapa de Almacenes</h2>
      <div class="search-container">
        <select 
          id="warehouse-select" 
          v-model="focusedWarehouseId" 
          @change="focusOnWarehouse" 
          class="search-dropdown"
        >
          <option v-for="almacen in almacenes" :key="almacen.id_almacen" :value="almacen.id_almacen">
            {{ almacen.nombre }}
          </option>
        </select>
      </div>
      <MapSelectV2 
        ref="warehouseMapComponent" 
        :items="almacenes" 
        :focusedItem="focusedWarehouse" 
        itemType="almacenes" 
        @item-selected="selectWarehouse" 
      />
    </div>

    <v-btn 
      color="#e29818ff" 
      size="small" 
      variant="tonal" 
      class="boton-chico" 
      @click="flyToSelections"
    >
      Ir a Cliente y Almacén Seleccionados
    </v-btn>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import MapSelect from "~/components/MapSelect.vue";
import MapSelectV2 from "~/components/MapSelectV2.vue";
import { useClienteService } from "~/services/clienteService";
import { useAlmacenService } from "~/services/almacenService";

export default {
  name: "ClientesYAlmacenes",
  components: { Header, MapSelect, MapSelectV2 },
  data() {
    return {
      clientes: [],
      almacenes: [],
      focusedClient: null,
      focusedClientId: null,
      focusedWarehouse: null,
      focusedWarehouseId: null,
      loading: true
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const { getAllClientes } = useClienteService();
        const { obtenerAlmacenes } = useAlmacenService();

        const [clientes, almacenes] = await Promise.all([
          getAllClientes(), 
          obtenerAlmacenes()
        ]);
        
        this.clientes = clientes;
        this.almacenes = almacenes;
      } catch (error) {
        console.error('Error al obtener clientes o almacenes:', error);
      } finally {
        this.loading = false;
      }
    },
    selectClient(cliente) {
      this.focusedClient = cliente;
      this.focusedClientId = cliente.id_cliente;
    },
    selectWarehouse(almacen) {
      this.focusedWarehouse = almacen;
      this.focusedWarehouseId = almacen.id_almacen;
    },
    async findNearestWarehouse() {
      if (!this.focusedClientId) {
        alert('Por favor seleccione un cliente primero.');
        return;
      }
      try {
        const { cercanoCliente } = useClienteService();
        const nearestWarehouse = await cercanoCliente(this.focusedClientId);
        this.focusedWarehouse = nearestWarehouse;
        this.focusedWarehouseId = nearestWarehouse.id_almacen;
        this.$refs.warehouseMapComponent.flyTo(nearestWarehouse);
      } catch (error) {
        console.error('Error al encontrar el almacén más cercano:', error);
      }
    },
    focusOnClient() {
      const client = this.clientes.find(cliente => cliente.id_cliente === parseInt(this.focusedClientId));
      if (client) {
        this.focusedClient = client;
        this.$refs.clientMapComponent.flyTo(client);
      }
    },
    focusOnWarehouse() {
      const almacen = this.almacenes.find(almacen => almacen.id_almacen === parseInt(this.focusedWarehouseId));
      if (almacen) {
        this.focusedWarehouse = almacen;
        this.$refs.warehouseMapComponent.flyTo(almacen);
      }
    },
    flyToSelections() {
      if (this.focusedClient) {
        this.$refs.clientMapComponent.flyTo(this.focusedClient);
      }
      if (this.focusedWarehouse) {
        this.$refs.warehouseMapComponent.flyTo(this.focusedWarehouse);
      }
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

.map-container {
  margin-bottom: 20px;
  border-radius: 8px;
  padding: 20px;
}

.search-container {
  margin-bottom: 10px;
}

.search-dropdown {
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  width: 100%;
  background-color: #ffffff;
  color: #000000;
}

.boton-chico {
  margin-top: 20px;
}

.mb-4 {
  margin-bottom: 1rem;
}
</style>
