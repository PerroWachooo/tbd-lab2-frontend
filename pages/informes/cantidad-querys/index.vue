<template>
  <Header />
  <div class="background">

    <h1 class="lexend-deca-title">Querys</h1>
    <br>

    <div class="table-container" v-if="usuariosActivos && usuariosActivos.length > 0">
    <table class="invoice-table">
      <thead>
        <tr>
          <th>id Usuario</th>
          <th>Cantidad de Querys</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(usuario, index) in usuariosActivos" :key="index">
          <td>{{ usuario.id_registro }}</td>
          <td>{{ usuario.total_queries }}</td>
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
import { useAuditService } from "@/services/auditService";

export default {
  components: {
    Header,
  },
  data() {
    return {
      usuariosActivos: [],
      accesToken: null,
      refreshToken: null,
      id_usuario: null,
    };
  },
  async mounted() {
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

    this.fetchUsuariosActivos(); // Cargar usuarios activos
  },
  methods: {
    async fetchUsuariosActivos() {
      this.loading = true;
      try {
        const { obtenerUsuariosMasActivos } = useAuditService();
        const response = await obtenerUsuariosMasActivos();
        this.usuariosActivos = response;
        console.log("Usuarios activos cargados:", this.usuariosActivos);
      } catch (error) {
        console.error("Error al cargar los usuarios activos:", error);
      }
    },
  },
};
</script>

<style scoped>
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

.no-productos {
  font-size: 1.5rem;
  color: var(--primary-a100);
  text-align: center;
  padding: 2rem;
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
  max-width: 1200px; /* Define un ancho máximo para el contenedor */
  margin: 20px auto; /* Centra el contenedor en la página */
  padding: 20px; /* Espaciado interno */
  border: 1px solid #ccc; /* Borde del contenedor */
  border-radius: 8px; /* Esquinas redondeadas */
  background-color: var(--surface-a60); /* Fondo del contenedor */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra para darle relieve */
  color: #f0f0f0; /* Color de texto */
}

/* Tabla */
.invoice-table {
  width: 100%; /* La tabla ocupa todo el ancho del contenedor */
  border-collapse: collapse; /* Bordes colapsados */
  font-family: 'Roboto', sans-serif; /* Fuente */
}

/* Estilos de celdas y encabezados */
.invoice-table th,
.invoice-table td {
  padding: 10px; /* Espaciado interno */
  text-align: left; /* Alineación del texto */
  border: 1px solid #ddd; /* Bordes de las celdas */
}

/* Encabezados */
.invoice-table th {
  background-color: var(--primary-a0); /* Fondo azul para encabezados */
  color: white; /* Texto blanco */
  font-weight: bold;
}

/* Filas alternadas */
.invoice-table tr:nth-child(even) {
  background-color: var(--surface-a20); /* Fondo gris claro para filas pares */
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
