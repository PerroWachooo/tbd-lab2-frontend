import { useNuxtApp } from "#app";
import type { usuarioActivo } from "@/models/usuarioActivo";
import type { clienteMultiCompras } from "@/models/clientesMultiCompras";

export const useAuditService = () => {
    const { $axiosService } = useNuxtApp();

    const obtenerUsuariosMasActivos = async (token: string): Promise<usuarioActivo[]> => {
        const { data } = await $axiosService.get<usuarioActivo[]>("/api/auditoria/usuariosMasActivos", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    };

    const obtenerClientesMultiplesCompras = async (token: string): Promise<clienteMultiCompras> => {
        const { data } = await $axiosService.get<clienteMultiCompras>("/api/auditoria/clientesMultiplesCompras", {
            headers: {
                Authorization: `Bearer ${token}`
            },
           
        });
        return data;
    };

    return {
        obtenerUsuariosMasActivos,
        obtenerClientesMultiplesCompras
    };
};