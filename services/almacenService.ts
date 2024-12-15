import { useNuxtApp } from "#app";
import type { Almacen } from "@/models/almacen";
import type { Orden } from "@/models/orden";


export const useAlmacenService = () => {
    const { $axiosService } = useNuxtApp();

    const obtenerAlmacenes = async (token: string): Promise<Almacen[]> => {
        const { data } = await $axiosService.get<Almacen[]>("/api/almacen/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    };

    const obtenerAlmacen = async (id: number, token: string): Promise<Almacen> => {
        const { data } = await $axiosService.get<Almacen>(`/api/almacen/id-almacen/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    };

    const crearAlmacen = async (almacen: Almacen, token: string): Promise<Almacen> => {
        const { data } = await $axiosService.post<Almacen>("/api/almacen/", almacen, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    };

    const actualizarAlmacen = async (almacen: Almacen, token: string): Promise<Almacen> => {
        const { data } = await $axiosService.put<Almacen>(`/api/almacen/`, almacen, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    };

    const eliminarAlmacen = async (id: number, token: string): Promise<void> => {
        await $axiosService.delete(`/api/almacen/delete-almacen/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    };

    const obtenerOrdenesCercanas = async (idAlmacen: number, radioKm: number, token: string): Promise<Orden[]> => {
        const { data } = await $axiosService.get<Orden[]>(`/api/almacen/ordenes-cercanas/${idAlmacen}/${radioKm}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    };

    return {
        obtenerAlmacenes,
        obtenerAlmacen,
        crearAlmacen,
        actualizarAlmacen,
        eliminarAlmacen,
        obtenerOrdenesCercanas
    };
}