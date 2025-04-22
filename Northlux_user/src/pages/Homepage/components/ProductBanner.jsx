import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { useEffect, useState } from "react";
import { FreeMode, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import React from "react";

// function ProductBanner({ banners }) {
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   // Add window resize listener to update slide widths dynamically
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   // Calculate slide width based on current window width
//   const getSlideWidth = () => {
//     if (windowWidth < 576) return "95%"; // smallPhone
//     if (windowWidth < 768) return "55%"; // phone
//     if (windowWidth < 992) return "50%"; // tablets
//     if (windowWidth < 1200) return "45%"; // bigTablets
//     if (windowWidth < 1400) return "40%"; // desktop
//     return "35%"; // bigDesktop
//   };

//   // Create duplicated posts if there are fewer than 4
//   // This ensures smooth looping with small datasets
//   const getSlidesData = () => {
//     // Add safety check for banners
//     if (!banners || !Array.isArray(banners) || banners.length === 0) {
//       return [];
//     }

//     if (banners.length >= 4) return banners;

//     // Create duplicates with unique keys for React
//     const duplicatedPosts = [...banners];
//     const neededCopies = Math.ceil(4 / banners.length) - 1;

//     for (let i = 0; i < neededCopies; i++) {
//       banners.forEach((post, index) => {
//         duplicatedPosts.push({
//           ...post,
//           id: `${post.id}-copy-${i}-${index}`, // Ensure unique key
//         });
//       });
//     }
//     return duplicatedPosts;
//   };

//   const slidesData = getSlidesData();

//   // Add safety check before rendering
//   if (!slidesData.length) {
//     return null; // or return a loading state/placeholder
//   }

//   return (
//     <div className="product-banner" id="blogs">
//       <div className="product-banner__grid">
//         <Swiper
//           slidesPerView={"auto"}
//           centeredSlides={true}
//           spaceBetween={0}
//           loop={true}
//           loopedSlides={true} // Adjust looped slides
//           initialSlide={0}
//           pagination={{
//             clickable: true,
//           }}
//           autoplay={{
//             delay: 3000,
//             disableOnInteraction: false,
//             pauseOnMouseEnter: true,
//           }}
//           speed={700}
//           touchRatio={1}
//           touchAngle={30}
//           modules={[FreeMode, Autoplay]}
//           className="mySwiper"
//           wrapperClass="swiper-wrapper"
//           cssMode={false}
//           loopFillGroupWithBlank={true}
//           loopAdditionalSlides={slidesData?.length > 3 ? 3 : slidesData?.length}
//           centeredSlidesBounds={false}
//           // grabCursor={true}
//           watchSlidesProgress={true}
//           observer={true}
//           observeParents={true}
//           resistance={true}
//           resistanceRatio={0.85}
//         >
//           {slidesData.map((post) => (
//             <SwiperSlide
//               key={post.id}
//               aria-label={`Product ${post.title}`}
//               style={{
//                 width: getSlideWidth(),
//                 margin: "0 10px",
//               }}
//               // onClick={() => navigate(`/blogs/${post.name}`)}
//             >
//               <div className="product-card">
//                 <div
//                   className="product-card__image"
//                   style={{
//                     background: `url(${post.image})`,
//                     backgroundSize: "contain",
//                     backgroundPosition: "center",
//                     backgroundRepeat: "no-repeat",
//                   }}
//                 >
//                   <div className="overlay-content">
//                     {/* <div className="product-card__category">
//                       {post.categories && post.categories.map((category, index) => (
//                         <React.Fragment key={index}>
//                           {category}
//                           {index < post.categories.length - 1 && (
//                             <span className="separator">|</span>
//                           )}
//                         </React.Fragment>
//                       ))}
//                     </div> */}
//                     {/* <h3
//                       className="product-card__title"
//                       style={{
//                         fontWeight: "400",
//                         textAlign: "start",
//                         marginLeft: "0",
//                         marginTop: "-3rem",
//                       }}
//                     >
//                       {post.title}
//                     </h3> */}
//                   </div>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// }

function ProductBanner({ banners }) {
  return (
    <div className="product-banner-container">
      <Swiper
        slidesPerView={1.5}
        centeredSlides={true}
        spaceBetween={0}
        loop={true}
        loopedSlides={banners?.length}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={700}
        modules={[FreeMode, Autoplay]}
        className="mySwiper"
        wrapperClass="swiper-wrapper"
        cssMode={false}
        loopFillGroupWithBlank={true}
        loopAdditionalSlides={banners?.length > 3 ? 3 : banners?.length}
        centeredSlidesBounds={false}
        watchSlidesProgress={true}
        observer={true}
        observeParents={true}
        resistance={true}
        resistanceRatio={0.85}
      >
        {banners?.map((post) => (
          <SwiperSlide>
            <div className="product-card">
              <div
                className="product-card__image"
                style={{
                  background: `url(${post.image})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductBanner;
