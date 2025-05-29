import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOfferBanner } from "../../../hooks/queries/offerBanner";
import LoadingSpinner from "../../../components/LoadingSpinner";

function Offer() {
  const { offerBanner, isLoading, error } = useOfferBanner();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);


  console.log(offerBanner , "offerBanner");

  useEffect(() => {
    // Ensure component is mounted
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    // Only start auto-sliding when we have data and component is mounted
    if (!mounted || !offerBanner?.length) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === offerBanner.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [offerBanner, mounted]);

  // Always render the container to maintain layout
  if (!mounted || isLoading) {
    return (
      <div className="offer-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !offerBanner?.length) {
    return (
      <div className="offer-container">
        <div className="offer-content">
          <div className="offer-text">
            <h2>Special Offers</h2>
            <p>{error ? 'Error loading offers' : 'No offers available'}</p>
          </div>
        </div>
      </div>
    );
  }

  const banner = offerBanner[currentIndex];

  return (
    <div className="offer-container">
      <div className={`offer-content`} onClick={() => window.open(banner?.link, "_blank")}>
        <div className="offer-image">
          <img src={banner?.image} alt="offer banner" loading="eager" />
        </div>
      </div>

      {offerBanner?.length > 1 && (
        <div className="slider-dots">
          {offerBanner?.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Offer;
