// services/clienteService.ts
import { useNuxtApp } from "#app";
import type { Cliente } from "@/models/cliente";
import type { Almacen } from "@/models/almacen";

export const useClienteService = () => {
    const { $axiosService } = useNuxtApp();

    /**
     * Crea un nuevo cliente.
     * @param cliente - Objeto Cliente a crear.
     * @returns El Cliente creado.
     */
    const createCliente = async (cliente: Cliente): Promise<Cliente> => {
        const { data } = await $axiosService.post<Cliente>("/api/clientes/", cliente);
        return data;
    };

    /**
     * Obtiene un cliente por su ID.
     * @param id - ID del cliente.
     * @returns El Cliente correspondiente.
     */
    const getClienteById = async (id: number): Promise<Cliente> => {
        try {
            const { data } = await $axiosService.get<Cliente>(`/api/clientes/${id}`);
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * Obtiene todos los clientes.
     * @returns Una lista de Clientes.
     */
    const getAllClientes = async (): Promise<Cliente[]> => {
        try {
            const { data } = await $axiosService.get<Cliente[]>("/api/clientes/");
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * Actualiza un cliente existente.
     * @param cliente - Objeto Cliente con datos actualizados.
     * @returns El Cliente actualizado.
     */
    const updateCliente = async (cliente: Cliente): Promise<Cliente> => {
        const { data } = await $axiosService.put<Cliente>("/api/clientes/", cliente);
        return data;
    };

    /**
     * Elimina un cliente por su ID.
     * @param id - ID del cliente a eliminar.
     */
    const deleteCliente = async (id: number): Promise<void> => {
        await $axiosService.delete(`/api/clientes/${id}`);
    };

    const cercanoCliente = async(id: number): Promise<Almacen> => {
        try {
            const { data } = await $axiosService.get<Almacen>(`/api/clientes/${id}/almacen-mas-cercano`);
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const obtenerDistanciaClienteAlmacen = async (idCliente: number, idAlmacen: number, token: string): Promise<number> => {
        const { data } = await $axiosService.get<number>(`/api/clientes/distancia/${idCliente}/${idAlmacen}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    };

    return {
        createCliente,
        getClienteById,
        getAllClientes,
        updateCliente,
        deleteCliente,
        cercanoCliente,
        obtenerDistanciaClienteAlmacen
    };
};
