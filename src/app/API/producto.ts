export const Valores = [
  { category: 'oscuros' },
  { category: 'diario' },
  { category: 'deportivos' },
];

export interface productos {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;

}
