import { axiosInstance } from "../axios/axiosInstance";

export const listProducts = (page) => {
  return axiosInstance.get(`product/get-products?page=${page}`);
};

export const addProduct = (formData) => {
  return axiosInstance.post("product/addproduct", formData);
};

export const getProductById = (id) => {
  return axiosInstance.get(`product/get-product/${id}`);
};

export const searchProducts = async ({ keyword, page = 1, limit = 3 }) => {
  try {
    const response = await axiosInstance.get(`product/search`, {
      params: {
        keyword,
        page,
        limit,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (productId, formData) => {
  const response = await axiosInstance.patch(
    `product/update-product?productId=${productId}`,
    formData
  );
  return response;
};
