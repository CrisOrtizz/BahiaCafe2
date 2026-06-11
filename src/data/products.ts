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
  {
    id: "mozzura-honey-250",
    name: "Mozzura Honey 250g",
    price: "$34.000 COP",
    notes: ["Miel", "Durazno", "Caramelo"],
    description: "Proceso honey que intensifica la dulzura natural del grano.",
    image: "/images/mozzura250.jpg",
  },
  {
    id: "mozzura-honey-500",
    name: "Mozzura Honey 500g",
    price: "$48.000 COP",
    notes: ["Miel", "Durazno", "Caramelo", "Floral"],
    description: "Perfil honey en su expresión más amplia. Para quienes exigen más.",
    image: "/images/mozzura500.jpg",
  },
];
