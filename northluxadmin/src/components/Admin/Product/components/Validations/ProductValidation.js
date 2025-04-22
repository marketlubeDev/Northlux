export const validateProduct = (productData, selectedVariant, images) => {
  const errors = {};

  // Common required fields
  if (!productData.name?.trim()) errors.name = "Product name is required";
  if (!productData.brand) errors.brand = "Brand is required";
  if (!productData.category) errors.category = "Category is required";
  if (!productData.label) errors.label = "Label is required";
  // if (!productData.units) errors.units = "Units is required";

  // Validate variant selection
  if (!selectedVariant) {
    errors.variantSelection = "Please select a variant option";
    return errors;
  }

  if (selectedVariant === "hasVariants") {
    if (productData.variants.length === 0) {
      errors.variants = "At least one variant is required";
    }
    // ... rest of variant validations ...
  } else if (selectedVariant === "noVariants") {
    // Non-variant product validation
    if (!productData.sku?.trim()) errors.sku = "SKU is required";
    if (!productData.price) errors.price = "Price is required";
    if (!productData.offerPrice) errors.offerPrice = "Offer price is required";
    if (!productData.stock) errors.stock = "Stock is required";
    if (!productData.description?.trim())
      errors.description = "Description is required";

    // Numeric validation
    if (isNaN(productData.price)) errors.price = "Price must be a number";
    if (isNaN(productData.offerPrice))
      errors.offerPrice = "Offer price must be a number";
    if (isNaN(productData.stock)) errors.stock = "Stock must be a number";

    // Price logic
    if (Number(productData.offerPrice) >= Number(productData.price)) {
      errors.offerPrice = "Offer price must be less than regular price";
    }

    // Image validation
    if (!images?.some((image) => image)) {
      errors.images = "At least one product image is required";
    }
  }

  // ... rest of the validation logic
  return errors;
};
