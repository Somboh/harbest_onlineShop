//Convierte un producto del backend (campos en español, foto_url plano) al
//shape que usa el frontend (`name`, `image`, `seller`, ...). El resto de la
//app (CartContext, FavoritesContext, ProductDetail, ProductCard) trata todos
//los productos por igual sin saber de qué tabla vienen.
export function hydrateProduct(raw) {
  if (!raw) return null;

  const id = raw.id ?? raw.product_id;
  const price = typeof raw.precio === "number" ? raw.precio : Number(raw.precio) || 0;

  return {
    id,
    name: raw.nombre ?? raw.name ?? "",
    subtitle: raw.subtitle ?? "",
    description: raw.descripcion ?? raw.description ?? "",
    seller: raw.seller ?? raw.email_agricultor ?? "",
    email_agricultor: raw.email_agricultor ?? null,
    category: raw.categoria ?? raw.category ?? "",
    price,
    unit: raw.unit ?? "kg",
    badge: raw.badge ?? "",
    rating: raw.valoracion ?? raw.rating ?? 0,
    location: raw.location ?? "",
    deliveryTime: raw.deliveryTime ?? "",
    image: raw.foto_url ? { uri: raw.foto_url } : null,
    featured: raw.featured ?? false,
    stock: raw.cantidad ?? raw.stock ?? 0,
  };
}

export function hydrateProducts(rawList) {
  return (Array.isArray(rawList) ? rawList : []).map(hydrateProduct).filter(Boolean);
}
