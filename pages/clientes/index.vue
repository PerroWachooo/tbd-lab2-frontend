<template>
  <!-- Encabezado con botones de notificaciones y cerrar sesión -->
  <Header />

  <div class="background">
    <h1 class="lexend-deca-title">CLIENTES</h1>

    <!-- Botón para añadir clientes -->
    <div class="boton-clientes">
      <v-btn color="#e29818ff" size="small" variant="tonal" class="boton-chico" @click="irAAñadir">
        Añadir Cliente
      </v-btn>
    </div>

    <br>

    
    <!-- Lista de clientes -->
    <v-container>
      <v-row>
        <!-- Mostrar skeleton loader mientras se carga -->
        <v-col cols="12" sm="6" md="4" v-if="loading" v-for="n in 6" :key="n">
          <v-skeleton-loader type="card" color="var(--mixed-a20)"></v-skeleton-loader>
        </v-col>
        <v-col v-for="cliente in clientes" :key="cliente.id_cliente" cols="12" sm="6" md="4" v-else>
          <v-card :title="cliente.nombre" variant="tonal" color="var(--primary-a0)">
            <v-card-subtitle >Contacto: </v-card-subtitle>
            <v-card-text>
              {{ cliente.email }}
              <br>
              {{ cliente.telefono }}
              <br>
              {{ cliente.direccion }}
            </v-card-text>
            <v-card-actions>
              <!-- Botón para editar el cliente -->
              <v-btn icon @click="editarCliente(cliente)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <!-- Botón para eliminar el cliente -->
              <v-btn icon @click="deleteCliente(cliente.id_cliente)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-dialog v-model="dialogEditar" max-width="500px">
        <v-card variant="elevated" color="var(--surface-a40)">
          <v-card-title>
            <span class="headline">Editar Cliente</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="formEditar">
              <v-text-field label="Nombre" color="var(--primary-a0)" v-model="clienteAEditar.nombre" ></v-text-field>
              <v-text-field label="Dirección" color="var(--primary-a0)" v-model="clienteAEditar.direccion"></v-text-field>
              <v-text-field label="Email" color="var(--primary-a0)" v-model="clienteAEditar.email"></v-text-field>
              <v-text-field label="Teléfono" color="var(--primary-a0)" v-model="clienteAEditar.telefono"></v-text-field>
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
        <v-card variant="elevated" color="var(--surface-a40)">
          <v-card-title>
            <span class="headline">Crear Cliente</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="formEditar">
              <v-text-field label="Nombre" color="var(--primary-a0)" v-model="newCliente.nombre" ></v-text-field>
              <v-text-field label="Dirección" color="var(--primary-a0)" v-model="newCliente.direccion"></v-text-field>
              <v-text-field label="Email" color="var(--primary-a0)" v-model="newCliente.email"></v-text-field>
              <v-text-field label="Teléfono" color="var(--primary-a0)" v-model="newCliente.telefono"></v-text-field>
            </v-form>
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
import Header from "@/components/Header.vue"; // Ajusta la ruta según tu estructura de archivos

export default {
  name: "Clientes",
  components: {
    Header,
  },
  data() {
    return {

      notas: [],
      newCliente: {
        id_cliente: null,
        nombre: "",
        direccion: "",
        email: "",
        telefono: "",
      },
      clientes: [],
      loading: true,
      token: "your-token-here", // Puedes obtenerlo de localStorage si es necesario
      searchParams: {
        id_cliente: null,
        nombre: "",
        direccion: "",
        email: "",
        telefono: "",
      },
      refreshToken: null,
      accesToken: null,
      id_usuario: null,
      dialogEditar: false,
      dialogCrear: false,
      clienteAEditar: null,
      menuFecha: false, // Para el date picker

    };
  },
  computed: {
  },
  mounted() {
    // Obtener valores del localStorage al montar el componente
    //this.refreshToken = localStorage.getItem('refresh_token');
    this.accesToken = localStorage.getItem('accessToken');
    this.userId = parseInt(localStorage.getItem('id_usuario'), 10);

    if (!this.accesToken || !this.userId) {
      console.error("--- Token de refresco o ID de usuario no disponibles");
      window.location.href = "/";
      // Maneja el error, por ejemplo, redirigiendo al login
      return;
    }
    this.fetchClientes(); // Cargar clientes
  },
  methods: {
    async fetchClientes(){
      this.loading = true;
      try {
        const { getAllClientes } = useClienteService();
        const response = await getAllClientes();
        this.clientes = response;
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      } finally {
      this.loading = false; // Finalizar la carga
    }
    },
    async deleteCliente(id_cliente) {
      // Pregunta mediante notificacion de navegador, está seguro de eliminar la tarea
      const isConfirmed = window.confirm("¿Estás seguro de eliminar el cliente?\nConsidere que eliminar un cliente con alguna orden activa no se concretará.");
      if (!isConfirmed) {
        return;
      }

      try {
        const clienteService = useClienteService();
        //console.log('Eliminando cliente con ID:', cliente);
        await clienteService.deleteCliente(id_cliente);
        console.log('Cliente eliminado en el backend.');

        // Elimina cliente de la lista
        const index = this.clientes.findIndex(t => t.id_cliente === id_cliente);
        if (index !== -1) {
          console.log('Eliminando cliente del frontend en el índice:', index);
          this.clientes.splice(index, 1);
          console.log('Clientes actuales:', this.clientes);
        }
      } catch (error) {
        console.error('Error al eliminar el cliente:', error);
      }
      //window.location.reload();
    },

    editarCliente(cliente) {
      // Crear una copia de la tarea para evitar modificarla directamente
      this.clienteAEditar = { ...cliente };
      this.dialogEditar = true;
    },
    async guardarEdicion(){
      try {
        const clienteService = useClienteService();
        // Actualizar el cliente en el backend
        await clienteService.updateCliente(this.clienteAEditar);
        // Actualizar el cliente en la lista local
        const index = this.clientes.findIndex(t => t.id_cliente === this.clienteAEditar.id_cliente);
        if (index !== -1) {
          this.clientes.splice(index, 1, this.clienteAEditar);
        }
        this.dialogEditar = false;
      } catch (error) {
        console.error('Error al guardar la edición:', error);
      }

    },
    async guardarCreacion(){
      try {
        const clienteService = useClienteService();
        // Crear el cliente en el backend
        const newCliente = await clienteService.createCliente(this.newCliente);
        // Agregar el cliente a la lista local
        this.clientes.push(newCliente);
        this.dialogCrear = false;
      } catch (error) {
        console.error('Error al guardar la creación:', error);
      }
    },
    irAAñadir() {
      this.dialogCrear = true;
      console.log('Añadir cliente');
    },
  },
};
</script>

<style scoped>
.v-card {
  color: white; /* Cambia este color según lo que necesites */
}
.background {
	background-color: #282828;
	min-height: 100vh;
	margin-top: 40px;
	display: flex;
	flex-direction: column;
	align-items: center;
	/* Centra horizontalmente */
	justify-content: flex-start;
	/* No centra verticalmente, coloca los elementos al inicio */
}

header h1 {
	margin-left: 20px;
	margin-top: 20px;
	font-size: 2.25rem;
	font-weight: bold;
	text-transform: uppercase;
}

nav {
	display: flex;
	height: 50px;
	gap: 10px;
	margin-top: 15px;
	margin-right: 20px;
}

.img-notif {
	width: 20px;
	height: 20px;
	margin-right: 5px;
}

.boton-clientes {
	display: flex;
	justify-content: center;
	margin-right: 20px;
	margin-top: 20px;
}

.boton-chico {
	font-size: 14px;
	padding: 6px 12px;
	min-width: 100px;
	text-transform: uppercase;
}

.clientes {
	padding: 20px;
}

.clientes h1 {
	font-size: 24px;
	margin-bottom: 10px;
}

.COMPLETADO {
	background-color: #e8f5e9;
	border-left: 4px solid #4caf50;
}

.PENDIENTE {
	background-color: #ffebee;
	border-left: 4px solid #f44336;
}

.boton-editar-eliminar {
	display: flex;
	justify-content: space-between;
	gap: 10px;
}

.search-section {
	width: 100%;
	max-width: 1200px;
	margin: 20px auto;
}

.lexend-deca-title {
	font-family: "Lexend Deca", sans-serif;
	font-optical-sizing: auto;
	color: var(--primary-a0);
	font-weight: 700;
	font-size: 4.25rem;
	font-style: normal;
}
</style>
