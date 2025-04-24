import React, { useState, useEffect } from "react";
import { useCategories } from "../hooks/queries/categories";
import { useNavigate } from "react-router-dom";
import { useBrands } from "../hooks/queries/brands";

const brands = [
  {
    id: 1,
    name: "Brand 1",
    description: "Brand 1 description",
  },
  {
    id: 2,
    name: "Brand 2",
    description: "Brand 2 description",
  },
  {
    id: 3,
    name: "Brand 3",
    description: "Brand 3 description",
  },
  {
    id: 4,
    name: "Brand 4",
    description: "Brand 4 description",
  },
  {
    id: 5,
    name: "Brand 5",
    description: "Brand 5 description",
  },
  {
    id: 6,
    name: "Brand 6",
    description: "Brand 6 description",
  },
  {
    id: 7,
    name: "Brand 7",
    description: "Brand 7 description",
  },
  {
    id: 8,
    name: "Brand 8",
    description: "Brand 8 description",
  },
  {
    id: 9,
    name: "Brand 9",
    description: "Brand 9 description",
  },
  {
    id: 10,
    name: "Brand 10",
    description: "Brand 10 description",
  },
  {
    id: 11,
    name: "Brand 11",
    description: "Brand 11 description",
  },
  {
    id: 12,
    name: "Brand 12",
  },
  {
    id: 13,
    name: "Brand 13",
  },
  {
    id: 14,
    name: "Brand 14",
  },
  {
    id: 15,
    name: "Brand 15",
  },
  {
    id: 16,
    name: "Brand 16",
  },
  {
    id: 17,
    name: "Brand 17",
  },
];

export const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownContent, setDropdownContent] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  // const [navState, setNavState] = useState(null);

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const { data: brandsData } = useBrands();

  const categories = categoriesData?.envelop?.data || [];
  const brands = brandsData?.data?.brands || [];

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
              onMouseEnter={() =>
                handleDropdownHover(category.subcategories, "subcategories")
              }
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
            <button className="view-all-container-button">View All</button>
          </div>
        </div>
      )}
    </div>
  );
};
