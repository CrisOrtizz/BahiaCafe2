export type Product = {
  id: string;
  name: string;
  price: string;
  notes: string[];
  description: string;
  image: string;
};

export const products: Product[] = [
  {
    id: "mozzura-250",
    name: "Mozzura Clásico 250g",
    price: "$30.000 COP",
    notes: ["Chocolate", "Frutos secos"],
    description: "Tueste medio, dulzura balanceada y un final largo y limpio.",
    image: "/images/mozzura250.jpg",
  },
  {
    id: "mozzura-500",
    name: "Mozzura Clásico 500g",
    price: "$43.000 COP",
    notes: ["Chocolate", "Frutos secos"],
    description: "El mismo perfil que amas, en formato para no quedarse corto.",
    image: "/images/mozzura500.jpg",
  },
];
