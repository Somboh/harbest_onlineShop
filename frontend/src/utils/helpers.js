export const normalizeText = (value = "") => {
  return value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export const filterProducts = (products, searchText = "", category = "Todos") => {
  const query = normalizeText(searchText);

  return products.filter((product) => {
    const matchesCategory = category === "Todos" || product.category === category;
    const searchableText = normalizeText(
      `${product.name} ${product.seller} ${product.category}`,
    );

    return matchesCategory && (query === "" || searchableText.includes(query));
  });
};

export const calculateCartSubtotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};
