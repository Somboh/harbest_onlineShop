const products = [
  {
    id: "naranjas-valencianas",
    name: "Naranjas Valencianas",
    subtitle: "Dulces, frescas y de proximidad",
    description:
      "Naranjas de cultivo ecologico, jugosas y con sabor natural intenso. Recolectadas directamente del productor para garantizar frescura y comercio justo.",
    seller: "Granjas Jaume",
    category: "Frutas",
    price: 1.7,
    unit: "kg",
    badge: "Ecologico",
    rating: 4.9,
    location: "Xativa",
    deliveryTime: "Entrega rapida",
    image: require("../../assets/images/comida/naranjas.webp"),
    featured: true,
    stock: 86,
  },
  {
    id: "aguacates-granada",
    name: "Aguacates de Granada",
    subtitle: "Cremosos y listos para consumir",
    description:
      "Aguacates de temporada cultivados en la costa tropical. Perfectos para ensaladas, tostadas y pedidos semanales.",
    seller: "Illo verdulerias",
    category: "Frutas",
    price: 3.2,
    unit: "kg",
    badge: "Organico",
    rating: 4.8,
    location: "Granada",
    deliveryTime: "45 min",
    image: require("../../assets/images/comida/aguacate.webp"),
    featured: true,
    stock: 42,
  },
  {
    id: "pimenton-vera",
    name: "Pimenton de la Vera",
    subtitle: "Aroma intenso y sabor tradicional",
    description:
      "Pimenton de molienda fina con aroma profundo. Ideal para guisos, arroces y elaboraciones artesanas.",
    seller: "Antonio & Co",
    category: "Especias",
    price: 6.4,
    unit: "kg",
    badge: "Tradicional",
    rating: 4.7,
    location: "La Vera",
    deliveryTime: "2 h",
    image: require("../../assets/images/comida/pimenton.jpg"),
    featured: true,
    stock: 25,
  },
  {
    id: "brocoli-fresco",
    name: "Brocoli fresco",
    subtitle: "Verde, crujiente y recien cortado",
    description:
      "Brocoli fresco de huerta local, seleccionado por tamano y punto de maduracion para mantener textura y sabor.",
    seller: "Verde Vivo",
    category: "Verduras",
    price: 2.95,
    unit: "kg",
    badge: "Fresco",
    rating: 4.6,
    location: "Murcia",
    deliveryTime: "Entrega hoy",
    image: require("../../assets/images/comida/brocoli.webp"),
    featured: false,
    stock: 34,
  },
  {
    id: "canela-molida",
    name: "Canela molida",
    subtitle: "Aromatica y lista para cocinar",
    description:
      "Canela molida con aroma dulce e intenso. Buena para reposteria, infusiones y platos especiados.",
    seller: "Esencias del Sur",
    category: "Especias",
    price: 4.2,
    unit: "kg",
    badge: "Aromatico",
    rating: 4.5,
    location: "Sevilla",
    deliveryTime: "Entrega hoy",
    image: require("../../assets/images/comida/canela.webp"),
    featured: false,
    stock: 18,
  },
  {
    id: "fresas-temporada",
    name: "Fresas de temporada",
    subtitle: "Dulces y recolectadas en su punto",
    description:
      "Fresas de temporada con color vivo y textura firme. Recomendadas para consumir en pocos dias.",
    seller: "Huerta del Sur",
    category: "Frutas",
    price: 5.1,
    unit: "kg",
    badge: "Temporada",
    rating: 4.8,
    location: "Huelva",
    deliveryTime: "Entrega rapida",
    image: require("../../assets/images/comida/fresas.jpg"),
    featured: false,
    stock: 29,
  },
  {
    id: "lechuga-romana",
    name: "Lechuga romana",
    subtitle: "Crujiente y de cultivo local",
    description:
      "Lechuga romana fresca, ideal para ensaladas y acompanamientos. Se entrega limpia y seleccionada.",
    seller: "EcoFruit",
    category: "Verduras",
    price: 1.5,
    unit: "ud",
    badge: "Natural",
    rating: 4.4,
    location: "Valencia",
    deliveryTime: "Entrega hoy",
    image: require("../../assets/images/comida/lechuga.webp"),
    featured: false,
    stock: 51,
  },
  {
    id: "zanahorias-huerta",
    name: "Zanahorias",
    subtitle: "Dulces, firmes y de proximidad",
    description:
      "Zanahorias frescas de huerta, perfectas para cocinar, cremas o consumir en crudo.",
    seller: "Huerta Viva",
    category: "Verduras",
    price: 1.9,
    unit: "kg",
    badge: "Fresco",
    rating: 4.6,
    location: "Castellon",
    deliveryTime: "Entrega rapida",
    image: require("../../assets/images/comida/zanahorias.jpg"),
    featured: false,
    stock: 47,
  },
];

export const mockProducts = products;

export const featuredProducts = products.filter((product) => product.featured);

export const getProductsByCategory = (category) => {
  if (!category || category === "Todos") {
    return products;
  }

  return products.filter((product) => product.category === category);
};

export const getProductById = (id) => {
  return products.find((product) => product.id === id) || products[0];
};

export default products;
