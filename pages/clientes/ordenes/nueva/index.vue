<template>
  <Header />
  <div class="background">
    <h1 class="lexend-deca-title">NUEVA ORDEN</h1>

    <!-- Botón para añadir órdenes -->
    <div class="boton-clientes">
      <v-btn color="#e29818ff" size="small" variant="tonal" class="boton-chico" @click="irAAñadir">
        Añadir Orden
      </v-btn>
    </div>

    <br />

    <v-card variant="elevated" color="var(--surface-a40)">
      <v-card-title>
        <span class="headline">Crear Orden</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="formCrear">
          <v-text-field label="Fecha" color="var(--primary-a0)" v-model="nuevaOrden.fecha_orden"
            type="datetime-local"></v-text-field>
          <v-select label="Cliente" color="var(--primary-a0)" v-model="nuevaOrden.id_cliente" :items="clientes"
            item-value="id_cliente">
            <template #item="{ item, props }">
              <v-list-item v-bind="props" :title="item.raw.nombre"></v-list-item>
            </template>
            <template #selection="{ item }">
              {{ item.nombre }}
            </template>
          </v-select>
          <v-select label="Estado" color="var(--primary-a0)" v-model="nuevaOrden.estado"
            :items="['Enviada', 'Pendiente', 'Pagada']"></v-select>
          <v-text-field label="Total" color="var(--primary-a0)" v-model="nuevaOrden.total" type="number"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="dialogCrear = false">Cancelar</v-btn>
        <v-btn color="green darken-1" text @click="guardarCreacion">Crear</v-btn>
      </v-card-actions>
    </v-card>

    

    <!-- Tabla de órdenes -->
    <div class="table-container" v-if="ordenes && ordenes.length > 0">
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Editar</th>
            <th>ID Orden</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Nombre Cliente</th>
            <th>Precio</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(orden, index) in ordenes" :key="index">
            <td>
              <button class="btn new-btn" @click="editarOrden(orden)">✏️</button>
            </td>
            <td>{{ orden.id_orden }}</td>
            <td>{{ orden.fecha_orden }}</td>
            <td>{{ orden.estado }}</td>
            <td>{{ getClienteNombre(orden.id_cliente) }}</td>
            <td>{{ orden.total }}</td>
            <td>
              <button class="btn new-btn" @click="deleteOrden(orden.id_orden)">🗑️</button>
              <button class="btn new-btn" @click="goToOrden(orden.id_orden)"><v-icon>mdi-eye</v-icon></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="no-productos">
      <br>
      <br>
      <br>
      <br>
      <br>
      <v-progress-circular indeterminate :size="58" :width="8"></v-progress-circular>
    </div>




  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import { useOrdenService } from "@/services/ordenesService";
import { useClienteService } from "@/services/clienteService";

export default {
  components: {
    Header,
  },
  data() {
    return {
      ordenes: [],
      clientes: [],
      searchParams: {
        id_cliente: null,
        nombre: "",
        direccion: "",
        email: "",
        telefono: "",
      },
      dialogEditar: false,
      dialogCrear: false,
      ordenAEditar: null,
      nuevaOrden: {
        id_orden: null,
        fecha_orden: "",
        estado: "",
        id_cliente: null,
        total: "",
      },
    };
  },
  mounted() {
    this.fetchClientes();
  },
  methods: {
    async fetchClientes(){
      try {
        const clienteService = useClienteService();
        this.clientes = await clienteService.getAllClientes();
      } catch (error) {
        console.error("Error al cargar los clientes:", error);
      }
    },
    irAAñadir() {
      this.dialogCrear = true;
    },
    getClienteNombre(id) {
      const cliente = this.clientes.find((cliente) => cliente.id_cliente === id);
      return cliente ? cliente.nombre : "Desconocido";
    },
    async guardarNuevaOrden() {
      try {
        const ordenService = useOrdenService();
        const nuevaOrden = await ordenService.createOrden(this.nuevaOrden);
        this.ordenes.push(nuevaOrden);
        this.dialogCrear = false;
      } catch (error) {
        console.error("Error al guardar la nueva orden:", error);
      }
    },
    editarOrden(orden) {
      this.ordenAEditar = { ...orden };
      this.dialogEditar = true;
    },
    async guardarEdicion() {
      try {
        const ordenService = useOrdenService();
        await ordenService.updateOrden(this.ordenAEditar);
        const index = this.ordenes.findIndex((o) => o.id_orden === this.ordenAEditar.id_orden);
        if (index !== -1) {
          this.ordenes.splice(index, 1, this.ordenAEditar);
        }
        this.dialogEditar = false;
      } catch (error) {
        console.error("Error al guardar la edición de la orden:", error);
      }
    },
    async deleteOrden(id_orden) {
      const isConfirmed = window.confirm("¿Estás seguro de eliminar esta orden?");
      if (!isConfirmed) return;

      try {
        const ordenService = useOrdenService();
        await ordenService.deleteOrden(id_orden);
        this.ordenes = this.ordenes.filter((orden) => orden.id_orden !== id_orden);
      } catch (error) {
        console.error("Error al eliminar la orden:", error);
      }
    },
    async guardarCreacion() {
      try {
        const ordenService = useOrdenService();

        if (!this.nuevaOrden.fecha_orden || !this.nuevaOrden.id_cliente || !this.nuevaOrden.estado || !this.nuevaOrden.total) {
          alert('Todos los campos son obligatorios');
          return;
        }

        this.nuevaOrden.total = parseFloat(this.nuevaOrden.total);
        const nuevaOrden = await ordenService.createOrden(this.nuevaOrden);

        this.ordenes.push(nuevaOrden);

        this.dialogCrear = false;
      } catch (error) {
        console.error("Error al crear la orden:", error);
      }
    },
    goToOrden(id_orden) {
      this.$router.push(`/clientes/ordenes/${id_orden}`);
    },
  },
};
</script>

<style scoped>

.v-card {
  color: white;
  /* Cambia este color según lo que necesites */
}
.background {
  background-color: #282828;
  min-height: 100vh;
  margin-top: 20px;
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

.lexend-deca-title {
  font-family: "Lexend Deca", sans-serif;
  font-optical-sizing: auto;
  color: var(--primary-a0);
  font-weight: 700;
  font-size: 4.25rem;
  font-style: normal;
}

.boton-chico {
  font-size: 14px;
  padding: 6px 12px;
  min-width: 100px;
  text-transform: uppercase;
}

.titulo-boton {
  text-align: center;
  padding: 2rem 0;
}

.boton-clientes {
  display: flex;
  justify-content: center;
  margin-right: 20px;
  margin-top: 20px;
}

.boton-productos {
  padding: 1rem 0;
}

.lista-productos {
  padding: 2rem;
}

.no-productos {
  font-size: 1.5rem;
  color: var(--primary-a100);
  text-align: center;
  padding: 2rem;
}

.info-producto {
  background-color: var(--surface-a100);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.v-btn {
  border-radius: 4px;
}

#btnToWatch {
  padding: 5px 10px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 15px;
  font-size: 18px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

/* Contenedor de botones */
.buttons-container {
  margin-bottom: 20px;
  padding-left: 15px;
}

/* Estilos base para los botones */
.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  font-size: 14px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  /* Transiciones suaves */
}

/* Botón "Nuevo" */
.new-btn {
  margin-top: 1rem;
  background-color: var(--primary-a0);
  color: white;
}

.new-btn:hover {
  background-color: var(--primary-a0);
  /* Color más oscuro al hacer hover */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  /* Sombra para efecto de elevación */
  transform: translateY(-2px);
  /* Efecto de elevación */
}

.new-btn:active {
  transform: translateY(1px);
  /* Efecto de presión al hacer clic */
}

/* Botón "Subir" */
.upload-btn {
  background-color: #bfc9ca;
  color: black;
}

.upload-btn:hover {
  background-color: #a8b0b2;
  /* Color más oscuro al hacer hover */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  /* Sombra para efecto de elevación */
  transform: translateY(-2px);
  /* Efecto de elevación */
}

.upload-btn:active {
  transform: translateY(1px);
  /* Efecto de presión al hacer clic */
}


/* Tabla */
/* Contenedor de la tabla */
.table-container {
  max-width: 1200px;
  /* Define un ancho máximo para el contenedor */
  margin: 20px auto;
  /* Centra el contenedor en la página */
  padding: 20px;
  /* Espaciado interno */
  border: 1px solid #ccc;
  /* Borde del contenedor */
  border-radius: 8px;
  /* Esquinas redondeadas */
  background-color: var(--surface-a60);
  /* Fondo del contenedor */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* Sombra para darle relieve */
  color: #f0f0f0;
  /* Color de texto */
}

/* Tabla */
.invoice-table {
  width: 100%;
  /* La tabla ocupa todo el ancho del contenedor */
  border-collapse: collapse;
  /* Bordes colapsados */
  font-family: 'Roboto', sans-serif;
  /* Fuente */
}

/* Estilos de celdas y encabezados */
.invoice-table th,
.invoice-table td {
  padding: 10px;
  /* Espaciado interno */
  text-align: left;
  /* Alineación del texto */
  border: 1px solid #ddd;
  /* Bordes de las celdas */
}

/* Encabezados */
.invoice-table th {
  background-color: var(--primary-a0);
  /* Fondo azul para encabezados */
  color: white;
  /* Texto blanco */
  font-weight: bold;
}

/* Filas alternadas */
.invoice-table tr:nth-child(even) {
  background-color: var(--surface-a20);
  /* Fondo gris claro para filas pares */
}


/* Estilos de estado */
.status-draft {
  background-color: #ccc;
  padding: 5px;
  border-radius: 4px;
}

.status-unpaid {
  background-color: #f1c40f;
  padding: 5px;
  border-radius: 4px;
}
</style>