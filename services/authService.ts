// services/authService.ts
import { useNuxtApp } from "#app";
import type { AxiosResponse } from "axios";

interface TokenResponse {
	access_token: string;
	refresh_token: string;
	id_usuario: number;
}

export const useAuthService = () => {
	const { $axiosService } = useNuxtApp();

	/**
	 * Autentica un usuario.
	 * @param username - Nombre de usuario.
	 * @param password - Contraseña del usuario.
	 * @returns El objeto con el token de autenticación y el refresh token.
	 */
	const authenticate = async (
		username: string,
		password: string
	): Promise<TokenResponse> => {
		const { data } = await $axiosService.post<TokenResponse>(
			"/api/auth/login",
			{
				username,
				password,
			},
			{ withCredentials: true }
		); // Asegura que se envíen las cookies
		// Almacenar el Access Token
		localStorage.setItem("accessToken", data.access_token);
		// Configurar el header Authorization
		$axiosService.defaults.headers.common[
			"Authorization"
		] = `Bearer ${data.access_token}`;
		return data;
	};

	/**
	 * Refresca el Access Token usando el Refresh Token almacenado en las cookies.
	 * @returns El nuevo Access Token.
	 */
	const refreshToken = async (): Promise<string> => {
		try {
			// Se asume que el Refresh Token está en una cookie HTTP-only
			const response: AxiosResponse<TokenResponse> =
				await $axiosService.post<TokenResponse>(
					"/api/auth/refresh",
					{},
					{ withCredentials: true }
				);

			const newAccessToken = response.data.access_token;
			// Actualizar el Access Token en localStorage
			localStorage.setItem("accessToken", newAccessToken);
			// Actualizar el header Authorization
			$axiosService.defaults.headers.common[
				"Authorization"
			] = `Bearer ${newAccessToken}`;
			return newAccessToken;
		} catch (error) {
			console.error("Error al refrescar el token:", error);
			redirectToLogin();
			throw error;
		}
	};

	/**
	 * Redirige al usuario a la página de login.
	 */
	const redirectToLogin = () => {
		window.location.href = "/"; // Ajusta la ruta según tu configuración
	};

	/**
	 * Cierra la sesión del usuario eliminando el Access Token y redirigiendo al login.
	 */
	const logout = () => {
		localStorage.removeItem("accessToken");
		// Opcional: también puedes eliminar otras informaciones de usuario aquí
		redirectToLogin();
	};

	return {
		authenticate,
		refreshToken,
		redirectToLogin,
		logout,
	};
};
