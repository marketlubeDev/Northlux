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
// import { useGroupLabels } from "../../hooks/queries/labels";
// import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
// import Card from "../../components/Card";
// import Sections from "./components/Sections";

// function Homepage() {
//   const { allBanners, isLoading, error } = useBanners();
//   const {
//     activeOffers,
//     isLoading: activeOffersLoading,
//     error: activeOffersError,
//   } = useActiveOffers();
//   const { data: groupLabels, isLoading: groupLabelsLoading } = useGroupLabels();

//   console.log(groupLabels , "groupLabels");
  

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
//       {/* <CarouselBanner data={activeOffers} isLoading={activeOffersLoading} /> */}
//       {/* <div className="divider-home" /> */}
//       {/* <Clearance /> */}
//       <div className="divider-home" />
//       <Bestseller />
//       {/* <div className="divider-home" /> */}
//       <Offer />
//       <CarouselBanner data={activeOffers} isLoading={activeOffersLoading} />
//       {/* <div className="divider-home" />
//       <Trending /> */}
//       <div className="divider-home" />
//       {
//         groupLabels?.data?.map((label, index) => (
//           <React.Fragment key={label?.label}>
//             <Sections label={label} />
//             {(index + 1) % 2 === 0 && index !== groupLabels.data.length - 1 && (
//               <CarouselBanner data={activeOffers} isLoading={activeOffersLoading} />
//             )}
//           </React.Fragment>
//         ))
//       }
//     </div>
//   );
// }

// export default Homepage;



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
      <div className="divider-home" />
      <CarouselBanner data={activeOffers} isLoading={activeOffersLoading} />
      <div className="divider-home" />
      <Clearance />
      <div className="divider-home" />
      <Bestseller />
      <div className="divider-home" />
      <Offer />
      <CarouselBanner data={activeOffers} isLoading={activeOffersLoading} />
      <div className="divider-home" />
      <Trending />
    </div>
  );
}

export default Homepage;
