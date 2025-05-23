import React, { useEffect, useState } from "react";
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

  const [isMobile, setIsMobile] = useState(false);

  // useEffect(() => {
  //   window.scrollTo({

  //     top: 0,
  //     behavior: "smooth",
  //   });
  // }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const heroBanners = allBanners
    ?.filter((banner) => banner?.bannerFor === "hero")
    .map((banner) => ({
      ...banner,
      image:
        isMobile && banner?.mobileImage ? banner?.mobileImage : banner?.image,
    }));

  return (
    <div>
      <Carousel data={heroBanners} isLoading={isLoading} />
      <ShopBy />
      <div
        style={{
          width: "85%",
          height: "1px",
          backgroundColor: "#E5E5E5",
          margin: "16px auto",
        }}
      />
      <ProductBanner banners={activeOffers} loading={activeOffersLoading} />
      <div
        style={{
          width: "85%",
          height: "1px",
          backgroundColor: "#E5E5E5",
          margin: "8px auto",
        }}
      />
      <Clearance />
      <div
        style={{
          width: "85%",
          height: "1px",
          backgroundColor: "#E5E5E5",
          margin: "8px auto",
        }}
      />
      <Bestseller />
      <div
        style={{
          width: "85%",
          height: "1px",
          backgroundColor: "#E5E5E5",
          margin: "8px auto",
        }}
      />
      <Offer />
      <div
        style={{
          width: "85%",
          height: "1px",
          backgroundColor: "#E5E5E5",
          margin: "8px auto",
        }}
      />
      <ProductBanner banners={activeOffers} loading={activeOffersLoading} />
      <div
        style={{
          width: "85%",
          height: "1px",
          backgroundColor: "#E5E5E5",
          margin: "8px auto",
        }}
      />
      <Trending />
    </div>
  );
}

export default Homepage;
