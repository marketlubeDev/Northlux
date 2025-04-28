import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { FreeMode, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import React from "react";

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
        {banners?.map((post, index) => (
          <SwiperSlide key={index}>
            <div className="product-card">
              <div
                className="product-card__image"
                style={{
                  backgroundPosition: "center",
                }}
              >
                <img
                  src={post.image}
                  alt="offer_banner"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "fill",
                  }}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductBanner;
