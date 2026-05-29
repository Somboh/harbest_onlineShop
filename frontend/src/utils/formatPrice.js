export const formatPrice = (value, currency = "EUR") => {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(number);
};

export const formatUnitPrice = (price, unit) => {
  return `${formatPrice(price)}${unit ? `/${unit}` : ""}`;
};

export default formatPrice;
