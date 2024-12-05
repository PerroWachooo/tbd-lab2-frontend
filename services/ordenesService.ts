import { useNuxtApp } from "#app";
import type { Orden } from "@/models/orden";

export const useOrdenService = () => {
    const { $axiosService } = useNuxtApp();

    /**
     * Crea una nueva orden.
     * @param orden - Objeto Orden a crear.
     * @returns La Orden creada.
     */
    const createOrden = async (orden: Orden): Promise<Orden> => {
        const { data } = await $axiosService.post<Orden>("/api/ordenes/", orden);
        return data;
    };

    /**
     * Obtiene una orden por su ID.
     * @param id - ID de la orden.
     * @returns La Orden correspondiente.
     */
    const getOrdenById = async (id: number): Promise<Orden> => {
        try {
            const { data } = await $axiosService.get<Orden>(`/api/ordenes/id-orden/${id}`);
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * Obtiene todas las órdenes.
     * @returns Una lista de Órdenes.
     */
    const getAllOrdenes = async (): Promise<Orden[]> => {
        try {
            const { data } = await $axiosService.get<Orden[]>("/api/ordenes/");
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * Actualiza una orden existente.
     * @param orden - Objeto Orden con datos actualizados.
     * @returns La Orden actualizada.
     */
    const updateOrden = async (orden: Orden): Promise<Orden> => {
        const { data } = await $axiosService.put<Orden>("/api/ordenes/", orden);
        return data;
    };

    /**
     * Elimina una orden por su ID.
     * @param id - ID de la orden a eliminar.
     */
    const deleteOrden = async (id: number): Promise<void> => {
        await $axiosService.delete(`/api/ordenes/delete-orden/${id}`);
    };

    return {
        createOrden,
        getOrdenById,
        getAllOrdenes,
        updateOrden,
        deleteOrden
    };
};
