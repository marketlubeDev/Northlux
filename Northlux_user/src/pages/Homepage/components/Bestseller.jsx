import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowRight as ViewAllIcon,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../../../hooks/queries/products";
import { useAddToCart } from "../../../hooks/queries/cart";
import ButtonLoadingSpinner from "../../../components/ButtonLoadingSpinners";

function Bestseller() {
  const navigate = useNavigate();
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  // Local state to track which button is loading
  const [loadingAction, setLoadingAction] = useState(null); // "buy" or "add"

  const { data, isLoading, error } = useProducts({
    labelId: "67e10f6c5b3d36dda0b0c4cc",
  });

  useEffect(() => {
    if (data?.data?.products) {
      setCurrentProduct(data?.data?.products[currentIndex]);
    }
  }, [data, currentIndex]);

  const bestsellerProducts = data?.data?.products || [];

  const handleNavigation = (direction) => {
    if (direction === "prev") {
      setCurrentIndex((prev) =>
        prev === 0 ? bestsellerProducts.length - 1 : prev - 1
      );
    } else {
      setCurrentIndex((prev) =>
        prev === bestsellerProducts.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleAddToCart = (type) => {
    const productToAdd = {
      productId: currentProduct._id,
      variantId: currentProduct?.variants?.[0]?._id || null,
      quantity: 1,
    };

    setLoadingAction(type);
    addToCart(productToAdd, {
      onSettled: () => {
        setLoadingAction(null);
        if (type === "buy") {
          navigate("/cart");
        }
      },
    });
  };

  const handleViewAll = () => {
    navigate("/products", {
      state: {
        selectedLabel: { _id: "67e10f6c5b3d36dda0b0c4cc", name: "Bestseller" },
      },
    });
  };

  return (
    <div className="bestseller-container" data-aos="fade-up">
      <div className="bestseller-header">
        <h3>
          Our Best Sellers- <span>Loved By Thousands</span>
        </h3>
        <p onClick={handleViewAll} className="view-all desktop-view-all">
          View All <ViewAllIcon />
        </p>
      </div>
      <div className="bestseller-content">
        <div className="bestseller-image-wrapper">
          <div className="bestseller-image">
            <span className="tag">{currentProduct?.label?.name}</span>
            <img
              src={currentProduct?.mainImage}
              alt={currentProduct?.name}
              className="fade-image"
              onClick={() => {
                console.log('Product ID:', currentProduct?._id);
                navigate(`/products/${currentProduct?._id}`);
              }}
            />
          </div>
        </div>
        <div className="bestseller-info">
          <div className="bestseller-navigation">
            <button
              className="nav-button prev"
              onClick={() => handleNavigation("prev")}
            >
              <FiArrowLeft />
            </button>
            <button
              className="nav-button next"
              onClick={() => handleNavigation("next")}
            >
              <FiArrowRight />
            </button>
          </div>
          <h2 className="fade-text">{currentProduct?.name}</h2>
          <p className="fade-text">{currentProduct?.description.split("").length > 500 ? currentProduct?.description.split("").slice(0, 500).join("") + "..." : currentProduct?.description}</p>
          <div className="buttons">
            <button
              className="add-to-cart"
              onClick={() => handleAddToCart("add")}
              disabled={loadingAction !== null}
            >
              {loadingAction === "add" ? (
                <ButtonLoadingSpinner />
              ) : (
                "Add To Cart"
              )}
            </button>
            <button
              onClick={() => handleAddToCart("buy")}
              className="buy-now"
              disabled={loadingAction !== null}
            >
              {loadingAction === "buy" ? <ButtonLoadingSpinner /> : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
      <p onClick={handleViewAll} className="view-all mobile-view-all">
        View All <ViewAllIcon />
      </p>
    </div>
  );
}

export default Bestseller;
