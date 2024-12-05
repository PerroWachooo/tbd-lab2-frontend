// axios.cliente.ts
import axios from "axios"; // Importación de valor
import type {
	AxiosError,
	AxiosInstance,
	AxiosResponse,
	AxiosRequestConfig,
} from "axios"; // Importaciones de solo tipo
import { defineNuxtPlugin, useRuntimeConfig } from "#app";
import { useAuthService } from "~/services/authService";

// Extiende la configuración de Axios para incluir una propiedad _retry
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	_retry?: boolean;
}

export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig();

	const instance: AxiosInstance = axios.create({
		baseURL: config.public.backBaseUrl,
		headers: {
			"Content-Type": "application/json",
		},
		withCredentials: true, // Para enviar cookies como el Refresh Token
	});

	// Inicializar el Access Token desde el almacenamiento local
	const accessToken = localStorage.getItem("accessToken");
	if (accessToken) {
		instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
	}

	// Importar el servicio de autenticación
	const { redirectToLogin } = useAuthService();

	// Bandera para evitar múltiples intentos de refresco simultáneos
	let isRefreshing = false;
	let failedQueue: Array<{
		resolve: (token: string) => void;
		reject: (error: any) => void;
	}> = [];

	// Esto evita que se hagan múltiples peticiones al servidor para refrescar el token
	const processQueue = (error: any, token: string | null = null) => {
		failedQueue.forEach((prom) => {
			if (error) {
				prom.reject(error);
			} else if (token) {
				prom.resolve(token);
			}
		});

		failedQueue = [];
	};

	// Interceptor de respuesta
	instance.interceptors.response.use(
		(response: AxiosResponse) => response,
		async (error: AxiosError) => {
			const originalRequest = error.config as
				| CustomAxiosRequestConfig
				| undefined;

			// Verifica si el error es 401 y si no se ha reintentado ya
			if (
				error.response?.status === 403 &&
				originalRequest &&
				!originalRequest._retry
			) {
				if (isRefreshing) {
					return new Promise<string>((resolve, reject) => {
						failedQueue.push({ resolve, reject });
					})
						.then((token) => {
							if (token && originalRequest.headers) {
								originalRequest.headers["Authorization"] = "Bearer " + token;
								return instance(originalRequest);
							}
							return Promise.reject(error);
						})
						.catch((err) => {
							return Promise.reject(err);
						});
				}

				originalRequest._retry = true;
				isRefreshing = true;

				return new Promise<string | void>(async (resolve, reject) => {
					try {
						// Aquí obtenemos `refreshToken` del servicio en contexto
						const { refreshToken } = useAuthService();

						if (!refreshToken) {
							throw new Error(
								"No se pudo acceder a los métodos de autenticación."
							);
						}

						const newToken = await refreshToken();

						if (newToken) {
							instance.defaults.headers.common[
								"Authorization"
							] = `Bearer ${newToken}`;
							if (originalRequest.headers) {
								originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
							}
							processQueue(null, newToken);
							resolve(instance(originalRequest));
						} else {
							processQueue(
								new Error("No se pudo obtener un nuevo token"),
								null
							);
							reject(error);
						}
					} catch (err) {
						processQueue(err, null);
						redirectToLogin();
						reject(err);
					} finally {
						isRefreshing = false;
					}
				});
			}

			return Promise.reject(error);
		}
	);

	// Proveer la instancia de Axios a toda la app
	return {
		provide: {
			axiosService: instance,
		},
	};
});
