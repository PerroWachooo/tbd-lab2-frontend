import { useNuxtApp } from '#app';
import type { Usuario } from '@/models/usuario';

export const useUsuarioService = () => {
    const { $axiosService } = useNuxtApp();

    /**
     * Crea un nuevo usuario.
     * @param usuario - Objeto que representa el usuario a crear.
     * @param token - Token de autenticación.
     * @returns El objeto Usuario creado.
     */
    const createUsuario = async (usuario: Usuario): Promise<Usuario> => {
        const { data } = await $axiosService.post<Usuario>('/api/auth/register', usuario);
        return data;
    };

    /**
     * Obtiene un usuario por su id.
     * @param id - Id del usuario a obtener.
     * @param token - Token de autenticación.
     * @returns El objeto Usuario correspondiente al id proporcionado.
     */
    const getUsuarioById = async (id: number, token: string): Promise<Usuario> => {
        try {
            const { data } = await $axiosService.get<Usuario>(`/api/usuario/id-usuario/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * Obtiene todos los usuarios.
     * @param token - Token de autenticación.
     * @returns Una lista de todos los usuarios.
     */
    const getAllUsuarios = async (token: string): Promise<Usuario[]> => {
        const { data } = await $axiosService.get<Usuario[]>('/api/usuario/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    };

    /**
     * Actualiza un usuario por su id.
     * @param id - Id del usuario a actualizar.
     * @param usuario - Objeto que contiene los datos actualizados del usuario.
     * @param token - Token de autenticación.
     * @returns El objeto Usuario actualizado.
     */
    const updateUsuario = async (id: number, usuario: Usuario, token: string): Promise<Usuario> => {
        const { data } = await $axiosService.put<Usuario>(`/api/usuario/${id}`, usuario, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    };

    /**
     * Elimina un usuario por su id.
     * @param id - Id del usuario a eliminar.
     * @param token - Token de autenticación.
     */
    const deleteUsuario = async (id: number, token: string): Promise<void> => {
        await $axiosService.delete(`/api/usuario/delete-usuario/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    };

    return {
        createUsuario,
        getUsuarioById,
        getAllUsuarios,
        updateUsuario,
        deleteUsuario
    };
}