import React, { useState } from "react";
import { useBrands } from "../../../hooks/queries/brands";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useCategories } from "../../../hooks/queries/categories";
import { Link, useNavigate } from "react-router-dom";

const ImageWithFallback = ({ src, alt, className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div className={`image-container ${className}`}>
      {isLoading && (
        <div className="image-placeholder">
          <LoadingSpinner />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
      />
      {error && (
        <div className="image-error">
          <span>{alt}</span>
        </div>
      )}
    </div>
  );
};

const ShopBy = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [isTabLoading, setIsTabLoading] = useState(false);
  const navigate = useNavigate();
  const {
    data: brandsData,
    isLoading: brandsLoading,
    isError: brandsError,
  } = useBrands();
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  const brands = brandsData?.data.brands;
  const categories = categoriesData?.envelop?.data;

  const handleCategoryClick = (category) => {
    navigate("/products", {
      state: {
        selectedCategory: {
          id: category._id,
          name: category.name,
        },
      },
    });
  };

  const handleTabChange = (tab) => {
    setIsTabLoading(true);
    setActiveTab(tab);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 300);
  };

  return (
    <section className="shop-by">
      <h2>Shop By</h2>
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => handleTabChange("categories")}
        >
          Categories
        </button>
        <button
          className={`tab-btn ${activeTab === "brands" ? "active" : ""}`}
          onClick={() => handleTabChange("brands")}
        >
          Brands
        </button>
      </div>
      {isTabLoading ? (
        <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner />
        </div>
      ) : activeTab === "brands" ? (
        brandsLoading ? (
          <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LoadingSpinner />
          </div>
        ) : (
          <div className="content">
            {brands?.slice(0, 10)?.map((brand, index) => (
              <div
                onClick={() => navigate(`/brands/${brand._id}`)}
                key={index}
                className="content-item"
              >
                <ImageWithFallback
                  src={brand.image}
                  alt={brand.name}
                  className="content-image"
                />
                <div className="content-overlay"></div>
                <h3 className="content-name">{brand.name}</h3>
              </div>
            ))}
          </div>
        )
      ) : categoriesLoading ? (
        <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner />
        </div>
      ) : (
        <div className="content">
          {categories?.map((category, index) => (
            <div
              key={index}
              className="content-item"
              onClick={() => handleCategoryClick(category)}
            >
              <ImageWithFallback
                src={category.image}
                alt={category.name}
                className="content-image"
              />
              <div className="content-overlay">
                <span className="content-name-background">{category.name}</span>
                <h3 className="content-name">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === "brands" && (
        <div className="browse-all">
          <button onClick={() => navigate("/brands")} className="browse-button">
            View all Brands →
          </button>
        </div>
      )}
    </section>
  );
};

export default ShopBy;
