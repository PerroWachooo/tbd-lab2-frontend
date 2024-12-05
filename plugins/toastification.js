// plugins/toastification.js
import { createToastInterface } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  const options = {
    // Opciones de configuración
  };

  // Crear una instancia de toast
  const toast = createToastInterface(options);

  // Hacer que el toast esté disponible en la app
  nuxtApp.provide('toast', toast);
});
