<template>
  <Header />

  <div class="background">
    <h1 class="lexend-deca-title">CLIENTES</h1>

    <div class="boton-clientes">
      <v-btn color="#e29818ff" size="small" variant="tonal" class="boton-chico" @click="irAAñadir">
        Añadir Cliente
      </v-btn>
    </div>

    <MapSelect ref="mapComponent" :clients="clientes" :focusedClient="focusedClient" />

    <v-container>
      <v-row>
        <v-col v-if="loading" v-for="n in 6" :key="n" cols="12" sm="6" md="4">
          <v-skeleton-loader type="card" color="var(--mixed-a20)"></v-skeleton-loader>
        </v-col>
        <v-col v-for="cliente in clientes" :key="cliente.id_cliente" cols="12" sm="6" md="4">
          <v-card :title="cliente.nombre" variant="tonal" color="var(--primary-a0)">
            <v-card-subtitle>Contacto:</v-card-subtitle>
            <v-card-text>
              <p>{{ cliente.email }}</p>
              <p>{{ cliente.telefono }}</p>
              <p>{{ cliente.direccion }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn icon @click="toggleClientFocus(cliente)">
                <v-icon>{{ isSelected(cliente) ? 'mdi-checkbox-marked-circle' : 'mdi-checkbox-blank-circle-outline' }}</v-icon>
              </v-btn>
              <v-btn icon @click="editarCliente(cliente)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="deleteCliente(cliente.id_cliente)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Diálogo de edición -->
      <v-dialog v-model="dialogEditar" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Editar Cliente</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="formEditar">
              <v-text-field label="Nombre" v-model="clienteAEditar.nombre"></v-text-field>
              <v-text-field label="Email" v-model="clienteAEditar.email"></v-text-field>
              <v-text-field label="Teléfono" v-model="clienteAEditar.telefono"></v-text-field>
            </v-form>
            <MapOneLocation @location-selected="updateDireccionFromMap" />
            <v-text-field 
              label="Dirección" 
              v-model="newCliente.direccion" 
              readonly
            ></v-text-field>
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
            <span class="headline">Crear Cliente</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="formCrear">
              <v-text-field label="Nombre" v-model="newCliente.nombre"></v-text-field>
              <v-text-field label="Email" v-model="newCliente.email"></v-text-field>
              <v-text-field label="Teléfono" v-model="newCliente.telefono"></v-text-field>
            </v-form>
            <MapOneLocation @location-selected="updateDireccionFromMap" />
            <v-text-field 
              label="Dirección" 
              v-model="newCliente.direccion" 
              readonly
            ></v-text-field>
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
import { useClienteService } from "~/services/clienteService";
import Header from "@/components/Header.vue";
import MapSelect from "~/components/MapSelect.vue";
import MapOneLocation from '~/components/MapOneLocation.vue';

export default {
  name: "Clientes",
  components: { Header, MapSelect, MapOneLocation },
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
    updateDireccionFromMap(location) {
      if (this.dialogCrear) {
        this.newCliente.direccion = location.place_name || location.address;
      } else if (this.dialogEditar) {
        this.clienteAEditar.direccion = location.place_name || location.address;
      }
    },
    editarCliente(cliente) {
      this.clienteAEditar = { ...cliente };
      this.dialogEditar = true;
    },
    async guardarEdicion() {
      if (!this.clienteAEditar.nombre || !this.clienteAEditar.direccion) {
        alert('El nombre y la dirección son obligatorios');
        return;
      }
      try {
        const { updateCliente } = useClienteService();
        await updateCliente(this.clienteAEditar);
        this.fetchClientes();
      } catch (error) {
        console.error('Error al actualizar el cliente:', error);
      } finally {
        this.dialogEditar = false;
        this.clienteAEditar = { nombre: '', direccion: '', email: '', telefono: '', posicion: "0.0", longitud:"0.0", latitud:"0.0" };
      }
    },
    async guardarCreacion() {
      if (!this.newCliente.nombre || !this.newCliente.direccion) {
        alert('El nombre y la dirección son obligatorios');
        return;
      }
      try {
        const { createCliente } = useClienteService();
        await createCliente(this.newCliente);
        this.fetchClientes();
      } catch (error) {
        console.error('Error al crear el cliente:', error);
      } finally {
        this.dialogCrear = false;
        this.newCliente = { nombre: '', direccion: '', email: '', telefono: '', posicion: "0.0", longitud:"0.0", latitud:"0.0" };
      }
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
    isSelected(cliente) {
      return this.focusedClient && this.focusedClient.id_cliente === cliente.id_cliente;
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
