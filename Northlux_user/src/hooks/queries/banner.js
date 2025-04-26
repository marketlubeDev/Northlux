import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/client";

export const useBanners = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["banners"],
    queryFn: () => apiClient.get("/offerBanner"),
  });
  const allBanners = data?.data?.data;
  console.log(allBanners, "asigdksagkasg");
  return { allBanners, isLoading, error };
};
