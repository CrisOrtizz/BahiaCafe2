export const brand = {
  name: "Bahía Café",
  description: "Café premium de origen colombiano.",
};

export const navigationLinks = [
  { href: "#manifesto", label: "Manifiesto" },
  { href: "#origin", label: "Origen" },
  { href: "#products", label: "Productos" },
];

export const sections = {
  hero: {
    eyebrow: brand.name,
    title: "Café premium de origen colombiano.",
  },
  manifesto: {
    title: "Manifiesto",
    body: "Creamos café con respeto por el origen, el proceso y el momento de quien lo disfruta.",
  },
  origin: {
    title: "Origen",
    body: "Seleccionamos lotes de café colombiano con trazabilidad y carácter propio.",
  },
  experience: {
    title: "Experiencia",
    body: "Cada producto está pensado para una preparación limpia, consistente y memorable.",
  },
  products: {
    title: "Productos",
    body: "Una base de productos lista para crecer con el catálogo.",
  },
  cta: {
    title: "Hablemos de café",
    body: "Estamos listos para acompañar tu selección.",
    productName: brand.name,
    action: "Contactar",
  },
};
