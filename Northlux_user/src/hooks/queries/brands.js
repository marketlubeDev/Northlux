import { useQuery } from "@tanstack/react-query";
import { brandService } from "../../api/services/brandService";
import apiClient from "../../api/client";

export const useBrands = (filters = {}) => {
  return useQuery({
    queryKey: ["brands", filters],
    queryFn: () => apiClient.get("/brand", { params: filters }).then((res) => res.data),
  });
};


export const useBrand = (id) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["brand", id],
    queryFn: () => apiClient.get(`/brand/${id}`),
  });

  const brand = data?.data?.data;
  return { brand, isLoading, error };
};
