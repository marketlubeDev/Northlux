export const initialProductState = {
  name: "",
  brand: "",
  category: "",
  label: "",
  description: "",
  sku: "",
  price: "",
  offerPrice: "",
  stock: "",
  grossPrice: "",
  store: "",
  variants: [],
  priority: 0,
};

export const initialVariantState = {
  _id: "",
  sku: "",
  attributes: {
    title: "",
    description: "",
  },
  price: "",
  offerPrice: "",
  stock: "",
  grossPrice: "",
  images: [],
};
