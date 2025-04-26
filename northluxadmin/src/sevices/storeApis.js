import { axiosInstance } from "../axios/axiosInstance";

export const getStores = async () => {
  const response = await axiosInstance.get(`/admin/getstores`);
  return response.data;
};

export const addStore = async (data) => {
  const response = await axiosInstance.post(`/admin/create-store`, data);
  return response.data;
};

export const updateStore = async (data, id) => {
  const response = await axiosInstance.patch(`/admin/edit-store/${id}`, data);
  return response.data;
};

export const getStoreAndProducts = async (
  id,
  page = 1,
  limit = 10,
  search = ""
) => {
  const response = await axiosInstance.get(`/admin/getstoreandproducts/${id}`, {
    params: {
      page,
      limit,
      search,
    },
  });
  return response.data;
};

export const storeLogin = async (data) => {
  const response = await axiosInstance.post(`/store/login`, data);
  return response.data;
};
