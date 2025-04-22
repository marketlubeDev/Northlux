import React, { useEffect } from "react";
import Carousel from "../../components/Carousel";
import ExclusiveSale from "./components/ExclusiveSale";
import ProductBanner from "../Homepage/components/ProductBanner";
import ShopByCategory from "./components/ShopByCategory";
import { useBanners } from "../../hooks/queries/banner";
import { useParams } from "react-router-dom";
import { useBrand, useBrands } from "../../hooks/queries/brands";

export default function BrandPage() {
  const { allBanners, isLoading, error } = useBanners();
  const { id } = useParams();
  const { brand, isLoading: brandLoading, error: brandError } = useBrand(id);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle loading states
  if (isLoading || brandLoading) {
    return <div>Loading...</div>;
  }

  // Handle error states
  if (error || brandError) {
    return <div>Error loading content</div>;
  }


  return (
    <div>
      <Carousel data={[brand]} maxHeight="500px" isBrand={true} />
      <ExclusiveSale id={id} />
      {/* <ProductBanner
        banners={allBanners?.filter(
          (banner) => banner?.bannerFor === "product"
        )}key={brand?.id}
      /> */}
      <ShopByCategory id={id} />
    </div>
  );
}
