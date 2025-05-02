import React from "react";
import Header from "../../components/Header";
import Carousel from "../../components/Carousel";
import Clearance from "./components/Clearance";
import Bestseller from "./components/Bestseller";
import Offer from "./components/Offer";
import Trending from "./components/Trending";
import ShopBy from "./components/ShopBy";
import ProductBanner from "./components/ProductBanner";
import { useBanners } from "../../hooks/queries/banner";
import { useActiveOffers } from "../../hooks/queries/activeOffer";
function Homepage() {
  const { allBanners, isLoading, error } = useBanners();
  const {
    activeOffers,
    isLoading: activeOffersLoading,
    error: activeOffersError,
  } = useActiveOffers();
  return (
    <div>
      <Carousel
        data={allBanners?.filter((banner) => banner?.bannerFor === "hero")}
        isLoading={isLoading}
      />
      <ShopBy />
      <ProductBanner banners={activeOffers} loading={activeOffersLoading} />
      <Clearance />
      <Bestseller />
      <Offer />
      <Trending />
    </div>
  );
}

export default Homepage;
