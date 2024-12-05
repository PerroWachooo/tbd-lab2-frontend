import { useNuxtApp } from "#app";
import type { Producto } from "@/models/producto";
export const useProductoService = () => {
    const { $axiosService } = useNuxtApp();
    /**
     * Permite crear un nuevo producto.
     * @param producto - Producto a crear.
     * @returns - El producto creado en la base de datos.
     */
    const createProducto = async (producto: Producto): Promise<Producto> => {
        const { data } = await $axiosService.post('/api/productos/', producto);
        return data;
    };
    /**
     * Obtiene todos los productos.
     * @returns - Una lista de todos los productos.
     */
    const getAllProductos = async (): Promise<Producto[]> => {
        try {
            const { data } = await $axiosService.get<Producto[]>('/api/productos/');
            return data;
        } catch (error) {
            console.error('Error obteniendo los productos:', error);
            throw error;
        }
    };
    /**
     * Obtiene un producto por su ID.
     * @param id - ID del producto.
     * @returns - El producto correspondiente al ID proporcionado.
     */
    const getProductoById = async (id: number): Promise<Producto> => {
        try {
            const { data } = await $axiosService.get<Producto>(`/api/productos/id-producto/${id}`);
            return data;
        } catch (error) {
            console.error('Error obteniendo el producto por ID:', error);
            throw error;
        }
    };
    /**
     * Actualiza un producto.
     * @param producto - Producto a actualizar.
     * @returns - El producto actualizado.
     */
    const updateProducto = async (producto: Producto): Promise<Producto> => {
        const { data } = await $axiosService.put<Producto>("/api/productos/", producto);
        return data;
    };

    /**
     * Elimina un producto por su ID.
     * @param id - ID del producto a eliminar.
     */
    const deleteProductoById = async (id: number): Promise<void> => {
        try {
            await $axiosService.delete(`/api/productos/delete-producto/${id}`);
        } catch (error) {
            console.error('Error eliminando el producto:', error);
            throw error;
        }
    };
    
    /**
     * Desactiva los productos sin stock.
     * @returns - Mensaje de éxito.
     */
    const desactivarProductosSinStock = async (): Promise<string> => {
        try {
            const { data } = await $axiosService.post<string>('/api/productos/desactivarProductos');
            return data;
        } catch (error) {
            console.error('Error desactivando productos sin stock:', error);
            throw error;
        }
    };

    return {
        createProducto,
        getAllProductos,
        getProductoById,
        updateProducto,
        deleteProductoById,
        desactivarProductosSinStock,
    };
};

