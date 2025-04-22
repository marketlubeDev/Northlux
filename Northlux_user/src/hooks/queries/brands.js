import { useQuery } from "@tanstack/react-query";
import { brandService } from "../../api/services/brandService";
import apiClient from "../../api/client";

export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: brandService.getAllBrands,
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
