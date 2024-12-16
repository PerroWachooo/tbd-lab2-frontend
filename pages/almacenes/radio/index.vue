<template>
  <Header />

  <div class="background">
    <h1 class="lexend-deca-title">ALMACENES</h1>

    <div class="boton-almacenes">
      <v-btn color="#e29818ff" size="small" variant="tonal" class="boton-chico" @click="irAAñadir">
        Añadir Almacén
      </v-btn>
    </div>

    <MapSelectV2 ref="mapComponent" :items="almacenes" :focusedItem="focusedWarehouse" itemType="almacenes" />

    <v-container>
      <v-row>
        <v-col v-if="loading" v-for="n in 6" :key="n" cols="12" sm="6" md="4">
          <v-skeleton-loader type="card" color="var(--mixed-a20)"></v-skeleton-loader>
        </v-col>
        <v-col v-for="almacen in almacenes" :key="almacen.id_almacen" cols="12" sm="6" md="4">
          <v-card :title="almacen.nombre" variant="tonal" color="var(--primary-a0)">
            <v-card-subtitle>Ubicación:</v-card-subtitle>
            <v-card-text>
              <p>{{ almacen.posicion }}</p>
              <p>{{ almacen.longitud }}</p>
              <p>{{ almacen.latitud }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn icon @click="editarAlmacen(almacen)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="deleteAlmacen(almacen.id_almacen)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn icon @click="toggleWarehouseFocus(almacen)">
                <v-icon>{{ isSelected(almacen) ? 'mdi-checkbox-marked-circle' : 'mdi-checkbox-blank-circle-outline' }}</v-icon>
              </v-btn>
              <v-btn icon @click="verOrdenesAlmacen(almacen)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-dialog v-model="dialogEditar" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Editar Almacén</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="formEditar">
              <v-text-field label="Nombre" v-model="almacenAEditar.nombre"></v-text-field>
              <MapOneLocationV2 @location-selected="updatePosicionFromMap" />
              <v-text-field label="Dirección" v-model="newAlmacen.posicion" readonly></v-text-field>
              <v-text-field label="Longitud" v-model="newAlmacen.lon" readonly></v-text-field>
              <v-text-field label="Latitud" v-model="newAlmacen.lat" readonly></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialogEditar = false">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="guardarEdicion">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      <v-dialog v-model="dialogCrear" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Crear Almacén</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="formCrear">
              <v-text-field label="Nombre" v-model="newAlmacen.nombre"></v-text-field>
              <MapOneLocationV2 @location-selected="updatePosicionFromMap" />
              <v-text-field label="Dirección" v-model="newAlmacen.posicion" readonly></v-text-field>
              <v-text-field label="Longitud" v-model="newAlmacen.lon" readonly></v-text-field>
              <v-text-field label="Latitud" v-model="newAlmacen.lat" readonly></v-text-field>
            </v-form>
            <MapOneLocation @location-selected="updateposicionFromMap" />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialogCrear = false">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="guardarCreacion">Crear</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Diálogo RF -->
      <v-dialog v-model="dialogVerOrdenes" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Ordenes a 10KM</span>
          </v-card-title>
          <v-card-text>
            {{ almacenACalcular.nombre }}

            <MapOneLocation @location-selected="updateposicionFromMap" />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialogCrear = false">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="guardarCreacion">Crear</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogVerOrdenesList" max-width="500px">
        <v-list>
          <v-card-title>
            <span class="headline">Ordenes a 10KM</span>
          </v-card-title>
          <v-card-text>
            {{ almacenACalcular.nombre }}
            <v-list-item v-for="orden in ordenes" :key="orden.id_orden">
              <v-list-item-content>
                <v-list-item-title>{{ orden.id_orden }}</v-list-item-title>
                <v-list-item-subtitle>{{ orden.fecha_orden }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ orden.estado }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ orden.total | currency }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card-text>
        </v-list>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useAlmacenService } from "~/services/almacenService";
import Header from "@/components/Header.vue";
import MapSelectV2 from "~/components/MapSelectV2.vue";
import MapOneLocationV2 from "~/components/MapOneLocationV2.vue";

export default {
  name: "Almacenes",
  components: { Header, MapSelectV2, MapOneLocationV2 },
  data() {
    return {
      newAlmacen: { nombre: '', posicion: '', longitud: '', latitud: '' },
      almacenAEditar: { nombre: '', posicion: '', longitud: '', latitud: '' },
      almacenACalcular: { nombre: '', posicion: '', longitud: '', latitud: '' },
      ordenes: [],
      almacenes: [],
      loading: true,
      focusedWarehouse: null,
      dialogEditar: false,
      dialogCrear: false,
      dialogVerOrdenes: false,
      dialogVerOrdenesList: false,
    };
  },
  mounted() {
    this.fetchAlmacenes();
  },
  methods: {
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
    },

    async obtenerOrdenes(idAlmacen, radioKm) {
      this.loading = true;
      try {
        const { obtenerOrdenesCercanas } = useAlmacenService();
        this.ordenes = await obtenerOrdenesCercanas(idAlmacen, radioKm);
      } catch (error) {
        console.error('Error al obtener las ordenes:', error);
      } finally {
        this.loading = false;
      }
    },
    
    editarAlmacen(almacen) {
      this.almacenAEditar = { ...almacen };
      this.dialogEditar = true;
    },
    calcularAlmacen(almacen) {
      this.almacenACalcular = { ...almacen };
      this.dialogVerOrdenes = true;
    },
    verOrdenesAlmacen(almacen) {
      this.almacenACalcular = { ...almacen };
      this.obtenerOrdenes(this.almacenACalcular.id_almacen, 10);
      console.log(this.ordenes);
      this.dialogVerOrdenesList = true;
    },
    async guardarEdicion() {
      try {
        const { actualizarAlmacen } = useAlmacenService();
        await actualizarAlmacen(this.almacenAEditar);
        this.fetchAlmacenes();
      } finally {
        this.dialogEditar = false;
      }
    },
    async guardarCreacion() {
      try {
        const { crearAlmacen } = useAlmacenService();
        await crearAlmacen(this.newAlmacen);
        this.fetchAlmacenes();
      } finally {
        this.dialogCrear = false;
      }
    },
    toggleWarehouseFocus(almacen) {
      this.focusedWarehouse = this.focusedWarehouse?.id_almacen === almacen.id_almacen ? null : almacen;
    },
    isSelected(almacen) {
      return this.focusedWarehouse && this.focusedWarehouse.id_almacen === almacen.id_almacen;
    },
    irAAñadir() {
      this.dialogCrear = true;
    }
  },
  watch: {
    dialogVerOrdenesList(val) {
      if (!val) {
        this.ordenes = []; // Limpiar la lista de órdenes cuando se cierre el diálogo
      }
    }
  }
};
</script>
