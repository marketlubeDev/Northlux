export const validateVariant = (variant) => {
  const errors = {};

  if (!variant.sku?.trim()) errors.sku = "SKU is required";
  if (!variant.attributes.title?.trim()) errors.title = "Title is required";
  if (!variant.attributes.description?.trim())
    errors.description = "Description is required";
  if (!variant.price) errors.price = "Price is required";
  if (!variant.offerPrice) errors.offerPrice = "Offer price is required";
  if (!variant.stock) errors.stock = "Stock is required";
  if (!variant.stockStatus) errors.stockStatus = "Stock status is required";

  // Numeric validation
  if (isNaN(variant.price)) errors.price = "Price must be a number";
  if (isNaN(variant.offerPrice))
    errors.offerPrice = "Offer price must be a number";
  if (isNaN(variant.stock)) errors.stock = "Stock must be a number";

  // Price logic
  if (Number(variant.offerPrice) >= Number(variant.price)) {
    errors.offerPrice = "Offer price must be less than regular price";
  }

  // Image validation
  if (!variant.images?.some((image) => image)) {
    errors.images = "At least one variant image is required";
  }

  return errors;
};
