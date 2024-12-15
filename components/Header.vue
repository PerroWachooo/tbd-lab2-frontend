<template>
  <header class="header">
    <div class="header-left">
      <!-- Logo -->
      <div class="logo">
        <img src="@/assets/logo.png" alt="Logo">
      </div>

      <!-- Menú de navegación -->
      <nav class="menu">
        <ul>
          <li><a href="/productos">Productos</a></li>
          <li><a href="/clientes/ordenes">Ordenes</a></li>
          <li><a href="/clientes">Clientes</a></li>
          <li><a href="/informes">Informes</a></li>
          <li><a href="/almacenes">Almacenes</a></li>
        </ul>
      </nav>
    </div>

    
  </header>
</template>

<script>


export default {
  data() {
    return {
      searchActive: false,
      userMenuActive: false,
    };
  },
  methods: {
    toggleSearch() {
      this.searchActive = !this.searchActive;
      if (this.searchActive) {
        this.$nextTick(() => {
          this.$refs.searchInput.focus();
        });
      }
    },
    toggleUserMenu() {
      this.userMenuActive = !this.userMenuActive;
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #282828;
  border-bottom: 1px solid #4d4b50;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo img {
  height: 40px;
}

.menu ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu ul li {
  margin: 0 15px;
}

.menu ul li a {
  text-decoration: none;
  color: #f0f0f0;
  font-weight: 600;
  transition: color 0.3s ease;
  font-family: 'Roboto', sans-serif;
  /* Asignar la fuente aquí */
}

.menu ul li a:hover {
  color:  var(--primary-a0);
  font-family: 'Roboto', sans-serif;
}

.header-right {
  display: flex;
  align-items: center;
}

.search-bar {
  position: relative;
  margin-right: 20px;
}

.search-bar input {
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
  transition: width 0.4s ease;
}

.search-input {
  width: 200px;
}

.search-icon {
  background: none;
  border: none;
  cursor: pointer;
}

.icon-size {
  width: 20px;
  height: 20px;
  /* Ajuste del tamaño del icono de búsqueda */
}

.header-icons {
  display: flex;
  align-items: center;
}

.header-icons button {
  background: none;
  border: none;
  margin-left: 10px;
  cursor: pointer;
}

.btn-user img {
  height: 24px;
}

.user-menu {
  position: absolute;
  top: 50px;
  right: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.user-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-menu ul li {
  margin: 10px 0;
}

.user-menu ul li a {
  text-decoration: none;
  color: #333;
}

.user-menu ul li a:hover {
  color: var(--primary-a0);
}
</style>