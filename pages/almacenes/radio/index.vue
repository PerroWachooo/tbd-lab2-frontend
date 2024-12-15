<template>
  <Header />

  <div class="background">
    <h1 class="lexend-deca-title">ALMACENES</h1>

    <div class="boton-almacenes">
      <v-btn color="#e29818ff" size="small" variant="tonal" class="boton-chico" @click="irAAñadir">
        Añadir Almacén
      </v-btn>
    </div>


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
              <v-btn icon @click="calcularAlmacen(almacen)">
                <v-icon>mdi-map-marker-radius</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Diálogo de edición -->
      <v-dialog v-model="dialogEditar" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Editar Almacén</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="formEditar">
              <v-text-field label="Nombre" v-model="almacenAEditar.nombre"></v-text-field>
              <v-text-field label="Posicion" v-model="almacenAEditar.posicion"></v-text-field>
              <v-text-field label="Longitud" v-model="almacenAEditar.longitud"></v-text-field>
              <v-text-field label="Latitud" v-model="almacenAEditar.latitud"></v-text-field>
            </v-form>
            <MapOneLocation @location-selected="updateposicionFromMap" />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialogEditar = false">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="guardarEdicion">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Diálogo de creación -->
      <v-dialog v-model="dialogCrear" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Crear Almacén</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="formCrear">
              <v-text-field label="Nombre" v-model="newAlmacen.nombre"></v-text-field>
              <v-text-field label="Dirección" v-model="newAlmacen.posicion"></v-text-field>
              <v-text-field label="Longitud" v-model="newAlmacen.longitud"></v-text-field>
              <v-text-field label="Latitud" v-model="newAlmacen.latitud"></v-text-field>
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
            <span class="headline">{{almacenACalcular.nombre}}</span>
          </v-card-title>
          <v-card-text>
            
            <MapOneLocation @location-selected="updateposicionFromMap" />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialogCrear = false">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="guardarCreacion">Crear</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useAlmacenService } from "~/services/almacenService";
import Header from "@/components/Header.vue";
import MapSelect from "~/components/MapSelect.vue";
import MapOneLocation from '~/components/MapOneLocation.vue';

export default {
  name: "Almacenes",
  components: { Header, MapSelect, MapOneLocation },
  data() {
    return {
      newAlmacen: { nombre: '', posicion: '', longitud: '', latitud: '' },
      almacenAEditar: { nombre: '', posicion: '', longitud: '', latitud: '' },
      almacenACalcular: { nombre: '', posicion: '', longitud: '', latitud: '' },
      almacenes: [],
      loading: true,
      focusedWarehouse: null,
      dialogEditar: false,
      dialogCrear: false,
      dialogVerOrdenes: false
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
    
    editarAlmacen(almacen) {
      this.almacenAEditar = { ...almacen };
      this.dialogEditar = true;
    },
    calcularAlmacen(almacen) {
      this.almacenACalcular = { ...almacen };
      this.dialogVerOrdenes = true;
    },
    async guardarEdicion() {
      if (!this.almacenAEditar.nombre || !this.almacenAEditar.posicion) {
        alert('El nombre y la dirección son obligatorios');
        return;
      }
      try {
        const { actualizarAlmacen } = useAlmacenService();
        await actualizarAlmacen(this.almacenAEditar);
        this.fetchAlmacenes();
      } catch (error) {
        console.error('Error al actualizar el almacén:', error);
      } finally {
        this.dialogEditar = false;
        this.almacenAEditar = { nombre: '', posicion: '', longitud: '', latitud: '' };
      }
    },
    async guardarCreacion() {
      if (!this.newAlmacen.nombre || !this.newAlmacen.posicion) {
        alert('El nombre y la dirección son obligatorios');
        return;
      }
      try {
        const { crearAlmacen } = useAlmacenService();
        await crearAlmacen(this.newAlmacen);
        this.fetchAlmacenes();
      } catch (error) {
        console.error('Error al crear el almacén:', error);
      } finally {
        this.dialogCrear = false;
        this.newAlmacen = { nombre: '', posicion: '', longitud: '', latitud: '' };
      }
    },
    async deleteAlmacen(id_almacen) {
      const isConfirmed = window.confirm("¿Estás seguro de eliminar el almacén?");
      if (!isConfirmed) return;
      try {
        const almacenService = useAlmacenService();
        await almacenService.eliminarAlmacen(id_almacen);
        this.almacenes = this.almacenes.filter(almacen => almacen.id_almacen !== id_almacen);
      } catch (error) {
        console.error('Error al eliminar el almacén:', error);
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
  padding: 20px;
}

.lexend-deca-title {
  font-family: 'Lexend Deca', sans-serif;
}

.boton-almacenes {
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
