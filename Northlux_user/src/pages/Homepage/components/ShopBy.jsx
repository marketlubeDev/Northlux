import React, { useState } from "react";
import { useBrands } from "../../../hooks/queries/brands";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useCategories } from "../../../hooks/queries/categories";
import { Link, useNavigate } from "react-router-dom";
const ShopBy = () => {
  const [activeTab, setActiveTab] = useState("categories");
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

  return (
    <section className="shop-by">
      <h2>Shop By</h2>
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button>
        <button
          className={`tab-btn ${activeTab === "brands" ? "active" : ""}`}
          onClick={() => setActiveTab("brands")}
        >
          Brands
        </button>
      </div>
      {/* <div className="content"> */}
      {activeTab === "brands" ? (
        brandsLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="content">
            {brands?.slice(0, 10)?.map((brand, index) => (
              <div
                onClick={() => navigate(`/brands/${brand._id}`)}
                key={index}
                className="content-item"
              >
                <img
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
      ) : (
        <div className="content">
          {categories?.map((category, index) => (
            <div
              key={index}
              className="content-item"
              onClick={() => handleCategoryClick(category)}
            >
              <img
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
      {/* </div> */}
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
