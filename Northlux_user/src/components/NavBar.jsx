import React, { useState, useEffect } from "react";
import { useCategories } from "../hooks/queries/categories";
import { useNavigate } from "react-router-dom";
import { useBrands } from "../hooks/queries/brands";

export const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [limit, setLimit] = useState(12);
  const [dropdownContent, setDropdownContent] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const [currentDropDownParent, setCurrentDropDownParent] = useState({
    id: null,
    name: null,
  });
  // const [navState, setNavState] = useState(null);

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories({ limit: limit });

  const { data: brandsData } = useBrands({ limit: limit });

  const categories = categoriesData?.envelop?.data || [];
  const brands = brandsData?.data?.brands || [];

  useEffect(() => {
    const updateLimitBasedOnScreenSize = () => {
      if (window.innerWidth < 768) {
        setLimit(8);
      } else {
        setLimit(12);
      }
    };

    // Set initial limit based on current screen size
    updateLimitBasedOnScreenSize();

    // Add event listener to update limit on window resize
    window.addEventListener("resize", updateLimitBasedOnScreenSize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateLimitBasedOnScreenSize);
    };
  }, []);

  const handleDropdownHover = (content, parent) => {
    // setNavState(parent);
    setDropdownContent({ content, parent });
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    setDropdownOpen(false);
  };

  const handleCategoryClick = (category) => {
    if (selectedCategory?._id === category._id) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }

    navigate("/products", {
      state: {
        selectedCategory: {
          id: category._id,
          name: category.name,
        },
      },
    });
  };

  const handleClickSubCategory = (subCategory) => {
    console.log(subCategory, "=========subCategory");

    if (dropdownContent?.parent === "subcategories") {
      navigate("/products", {
        state: {
          selectedSubCategory: subCategory,
        },
      });
    } else {
      const brandId = subCategory._id;
      navigate(`/brands/${brandId}`);
    }
  };

  const handleNavigateToParent = () => {
    if (dropdownContent?.parent === "brands") {
      navigate("/brands");
    } else if (dropdownContent?.parent === "subcategories") {
      navigate("/products", {
        state: {
          selectedCategory: {
            id: currentDropDownParent.id,
            name: currentDropDownParent.name,
          },
        },
      });
    }
  };

  console.log(currentDropDownParent, "===========currentDropDownParent");

  return (
    <div className="nav-bar-container">
      {categories && (
        <ul className="nav-bar-list">
          <li onClick={() => handleCategoryClick({ id: null, name: "All" })}>
            All
          </li>
          <li
            onMouseEnter={() => handleDropdownHover(brands, "brands")}
            onClick={() => navigate("/brands")}
            // onMouseLeave={handleDropdownLeave}
          >
            Brands
            <span className="arrow-icon"></span>
          </li>
          {categories.map((category) => (
            <li
              key={category._id}
              onMouseEnter={() => {
                handleDropdownHover(category.subcategories, "subcategories");
                setCurrentDropDownParent({
                  id: category._id,
                  name: category.name,
                });
              }}
              onClick={() => handleCategoryClick(category)}
              // onMouseLeave={handleDropdownLeave}
            >
              {category.name}
              <span className="arrow-icon"></span>
            </li>
          ))}
        </ul>
      )}

      {dropdownOpen && dropdownContent?.content?.length > 0 && (
        <div className="dropdown-content" onMouseLeave={handleDropdownLeave}>
          <ul className="dropdown-content-list">
            {dropdownContent?.content?.map((item) => (
              <div
                key={item.id || item._id}
                className="dropdown-content-list-item"
                onClick={() => handleClickSubCategory(item)}
              >
                <li>{item.name}</li>
                <p>{item.description}</p>
              </div>
            ))}
          </ul>
          <div className="view-all-container">
            <p>View All</p>
            <button
              className="view-all-container-button"
              onClick={() => handleNavigateToParent()}
            >
              View All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
