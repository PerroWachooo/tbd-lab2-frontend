<template>
  <!-- Encabezado con botones de notificaciones y cerrar sesión -->
  <Header />

  <div class="background">
    <h1 class="lexend-deca-title">ORDEN #{{ orden.id_orden }}</h1>

    <!-- Botón para añadir clientes -->

    <br>

    <v-container v-if="orden && detallesOrden.length > 0">
      <v-row>
        <!-- Primera columna -->
        <v-col cols="3">
          <v-card title="Orden" variant="tonal" elevation="24" color="var(--primary-a0)">
            <v-card-subtitle></v-card-subtitle>
            <v-card-text>
              ORDER NUMBER - #{{ orden.id_orden }} <br>
              FECHA - {{ orden.fecha_orden }} <br>
              ESTADO - {{ orden.estado }} <br>
              CLIENTE - {{ orden.id_cliente }} <br>
              TOTAL - {{ orden.total }}
            </v-card-text>
            <v-card-actions>
              <!-- Botón para editar el cliente -->
              <v-btn variant="tonal" base-color="orange" append-icon="mdi-cached" @click="activarDialog(orden)">
                Realizar Devolución
              </v-btn>
            </v-card-actions>
            <br>
          </v-card>
        </v-col>

        <!-- Segunda columna -->
        <v-col cols="8">
          <div class="table-container">
            <table class="invoice-table">
              <thead>
                <tr>
                  <th>ID DETALLE</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>ID Producto</th>
                  <th>Producto</th>
                  <th>ID ORDEN</th>
                  <th>BOTON</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(detalle, index) in detallesOrden" :key="index">
                  <td>{{ detalle.id_detalle }}</td>
                  <td>{{ detalle.cantidad }}</td>
                  <td>{{ detalle.precio_unitario }}</td>
                  <td>{{ detalle.id_producto }}</td>
                  <td>{{ detalle.producto }}</td>
                  <td>{{ detalle.id_orden }}</td>
                  <td>
                    <button class="btn new-btn" @click="editarDetalle(detalle)">
                      ✏️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h2 class="lexend-deca-title-t">Total: ${{ orden.total }}</h2>

        </v-col>
      </v-row>

      <v-dialog v-model="dialogDevolver" max-width="500px">
        <v-card variant="elevated" color="var(--surface-a40)">
          <v-card-title>
            <span class="headline">Realizar Devolución</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="formEditar">
              <v-text-field label="ID PRODUCTO" color="var(--primary-a0)"
                v-model="devolucion.idProducto"></v-text-field>
              <v-text-field label="CANTIDAD A DEVOLVER" color="var(--primary-a0)"
                v-model="devolucion.cantidad"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialogDevolver = false">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="realizarDevolucion(devolucion)">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-container>

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
import { useRouter } from "vue-router";
import { useOrdenService } from "~/services/ordenesService";
import { useDetalleOrdenService } from "~/services/detalleOrdenService";
import { useProductoService } from "~/services/productoService";
import Header from "@/components/Header.vue"; // Ajusta la ruta según tu estructura de archivos

export default {
  name: "Clientes",
  components: {
    Header,
  },
  data() {
    return {

      notas: [],
      devolucion: {
        idOrden: null,
        idProducto: null,
        cantidad: null,
      },
      orden: {
        id_orden: null,
        fecha_orden: "",
        estado: "",
        id_cliente: null,
        total: null,
      },
      productos: [],

      producto: {
        id_producto: null,
        nombre: "",
        descripcion: "",
        precio: null,
        stock: null,
        estado: "",
        id_categoria: null,
      },

      detallesOrden: [],
      loading: true,
      token: "your-token-here", // Puedes obtenerlo de localStorage si es necesario
      searchParams: {
        id_detalle: null,
        cantidad: "",
        precio_unitario: null,
        id_producto: null,
        id_orden: null,
        // producto
      },
      refreshToken: null,
      accesToken: null,
      id_usuario: null,
      dialogDevolver: false,

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
    this.fetchOrdenById();
    this.fetchDetallesOrden();
  },
  methods: {
    async fetchOrdenById() {
      const id = this.$route.params.ID_ORDEN;
      try {
        const ordenService = useOrdenService();
        this.orden = await ordenService.getOrdenById(id);
        this.loading = false;
      } catch (error) {
        console.error("Error al cargar la orden:", error);
      }
    },
    async fetchDetallesOrden() {
      const id = this.$route.params.ID_ORDEN;
      try {
        const detalleOrdenService = useDetalleOrdenService();
        this.detallesOrden = await detalleOrdenService.getDetallesByOrderId(id);
        this.loading = false;
      } catch (error) {
        console.error("Error al cargar los detalles de la orden:", error);
      }
      //por cada detalle fetch a los productos segun id de producto
      this.detallesOrden.forEach(async (detalle) => {
        try {
          const productoService = useProductoService();
          const producto = await productoService.getProductoById(detalle.id_producto);
          this.productos.push(producto);
          //console.log("Productos:", this.productos);
          // agrega a cada detalle el nombre del producto
          detalle.producto = producto.nombre;
        } catch (error) {
          console.error("Error al cargar los productos:", error);
        }
      });

    },
    activarDialog(orden) {
      this.dialogDevolver = true;
      this.devolucion.idOrden = orden.id_orden;
    },
    async realizarDevolucion(devolucion) {
      // utilizando el servicio de detalleOrdenService  y gestionarDevolucion
      // parsea a int
      devolucion.idOrden = parseInt(devolucion.idOrden);
      devolucion.idProducto = parseInt(devolucion.idProducto);
      devolucion.cantidad = parseInt(devolucion.cantidad);
      try {
        const detalleOrdenService = useDetalleOrdenService();
        await detalleOrdenService.gestionarDevolucion(devolucion);
        this.dialogDevolver = false;
        this.fetchDetallesOrden();
      } catch (error) {
        console.error("Error al realizar la devolución:", error);
      }
      // elimina el detalle de la orden usando el metodo
      try {
        const detalleOrdenService = useDetalleOrdenService();
        const detalle = this.detallesOrden.find((detalle) => detalle.id_producto === devolucion.idProducto);
        await detalleOrdenService.deleteDetalleOrden(detalle.id_detalle);
        this.fetchDetallesOrden();
        this.orden.total -= detalle.precio_unitario * devolucion.cantidad;

      } catch (error) {
        console.error("Error al eliminar el detalle de la orden:", error);
      }
      // elimina el detalle de detallesOrden
      const index = this.detallesOrden.findIndex((detalle) => detalle.id_detalle === devolucion.idOrden);
      if (index !== -1) {
        this.detallesOrden.splice(index, 1);
      }
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
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Centra horizontalmente */
  justify-content: flex-start;
  /* No centra verticalmente, coloca los elementos al inicio */
}

.col {
  flex: 1;
  margin-right: 20px;
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

.lexend-deca-title-t {
  font-family: "Lexend Deca", sans-serif;
  font-optical-sizing: auto;
  color: var(--primary-a0);
  font-weight: 700;
  font-size: 2.25rem;
  font-style: normal;
}

.no-productos {
  font-size: 1.5rem;
  color: var(--primary-a100);
  text-align: center;
  padding: 2rem;
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
</style>