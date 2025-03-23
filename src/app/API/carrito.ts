export interface carrito{
    id: string;
    userId: string;
    productoId: {
        id: string;
        nombre: string;
        precio: number;
        stock: number;
        categoria: string;
    };
    cantidad: number;
}