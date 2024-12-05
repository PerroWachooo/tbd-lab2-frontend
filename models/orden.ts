export interface Orden {
    id_orden: number;
    fecha_orden: string;
    estado: string;
    id_cliente: number;
    total: number;
}