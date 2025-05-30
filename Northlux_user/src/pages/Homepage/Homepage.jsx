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
import CarouselBanner from "../../components/CarouselBanner";
import { useGroupLabels } from "../../hooks/queries/labels";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Card from "../../components/Card";
import Sections from "./components/Sections";
import { useOfferBanner } from "../../hooks/queries/offerBanner";

function Homepage() {
  const { allBanners, isLoading } = useBanners();
  const { offerBanner, isLoading: offerBannerLoading } = useOfferBanner();

  const {
    activeOffers,
    isLoading: activeOffersLoading,
  } = useActiveOffers();
  const { data: groupLabels, isLoading: groupLabelsLoading } = useGroupLabels();



  

  const [isMobile, setIsMobile] = useState(false);
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
      <div className="divider-home" />
      <CarouselBanner data={activeOffers} isLoading={activeOffersLoading} />

      <div className="divider-home" />   
      <Bestseller />

      <div className="divider-home" />
      {/* Show first offer banner section */}
      {offerBanner?.length > 0 && offerBanner?.[0] && (
        <>
          <Offer 
            banners={offerBanner[0].banners}
            isLoading={offerBannerLoading}
            error={null}
          />
        </>
      )}
      { offerBanner?.length > 0 && groupLabels?.data?.length > 0 &&
        groupLabels?.data?.map((label, index) => (
          <React.Fragment key={label?.label}>
             <div className="divider-home" />
            <Sections label={label} />

            {(index + 1) % 2 === 0 && index !== groupLabels.data.length - 1 && (
              <>
                {offerBanner?.[Math.floor(index / 2) + 1] && (
                  <>
                  <div className="divider-home" />
                  <Offer 
                    banners={offerBanner[Math.floor(index / 2) + 1].banners}
                    isLoading={offerBannerLoading}
                    error={null}
                  />
        
                  </>
                )}

              </>
            )}
          </React.Fragment>
        ))
      }
      {/* Show remaining offer banner sections if any */}
      <div className="divider-home" />
      {offerBanner?.slice(Math.ceil(groupLabels?.data?.length / 2)).map((section) => (
        <React.Fragment key={section.section}>
   
          <Offer 
            banners={section.banners}
            isLoading={offerBannerLoading}
            error={null}
          />
          <div className="divider-home" />
        </React.Fragment>
      ))}
    </div>
  );
}

export default Homepage;



// import React, { useEffect, useState } from "react";
// import Header from "../../components/Header";
// import Carousel from "../../components/Carousel";
// import Clearance from "./components/Clearance";
// import Bestseller from "./components/Bestseller";
// import Offer from "./components/Offer";
// import Trending from "./components/Trending";
// import ShopBy from "./components/ShopBy";
// import ProductBanner from "./components/ProductBanner";
// import { useBanners } from "../../hooks/queries/banner";
// import { useActiveOffers } from "../../hooks/queries/activeOffer";
// import CarouselBanner from "../../components/CarouselBanner";

// function Homepage() {
//   const { allBanners, isLoading, error } = useBanners();
//   const {
//     activeOffers,
//     isLoading: activeOffersLoading,
//     error: activeOffersError,
//   } = useActiveOffers();

//   const [isMobile, setIsMobile] = useState(false);

//   // useEffect(() => {
//   //   window.scrollTo({

//   //     top: 0,
//   //     behavior: "smooth",
//   //   });
//   // }, []);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     handleResize(); // Initial check
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const heroBanners = allBanners
//     ?.filter((banner) => banner?.bannerFor === "hero")
//     .map((banner) => ({
//       ...banner,
//       image:
//         isMobile && banner?.mobileImage ? banner?.mobileImage : banner?.image,
//     }));

//   return (
//     <div>
//       <Carousel data={heroBanners} isLoading={isLoading} />
//       <ShopBy />
//       <div className="divider-home" />
//       <CarouselBanner data={activeOffers} isLoading={activeOffersLoading} />
//       <div className="divider-home" />
//       <Clearance />
//       <div className="divider-home" />
//       <Bestseller />
//       <div className="divider-home" />
//       <Offer />
//       <CarouselBanner data={activeOffers} isLoading={activeOffersLoading} />
//       <div className="divider-home" />
//       <Trending />
//     </div>
//   );
// }

// export default Homepage;
