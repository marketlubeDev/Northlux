import React, { useState } from "react";
import { useCategories } from "../hooks/queries/categories";
import { useNavigate } from "react-router-dom";

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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // New state for dropdown
  const navigate = useNavigate();
  const {
    data,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const categories = data?.envelop?.data || [];

  const handleCategoryClick = (category) => {
    if (selectedCategory?._id === category._id) {
      setSelectedCategory(null);
      setDropdownOpen(false); // Close dropdown if the same category is clicked
    } else {
      setSelectedCategory(category);
      setDropdownOpen(true); // Open dropdown for new category
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

  return (
    <div className="nav-bar-container">
      {categories && (
        <ul className="nav-bar-list">
          <li onClick={() => handleCategoryClick({ id: null, name: "All" })}>
            All
            <span className="arrow-icon"></span>
          </li>
          <li
            onClick={() => navigate("/brands")}
            onMouseEnter={() => setDropdownOpen(true)}
            // onMouseLeave={() => setDropdownOpen(false)}
          >
            Brands
            <span className="arrow-icon"></span>
            {dropdownOpen && (
              <div
                className="dropdown-content"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <ul className="dropdown-content-list">
                  {brands?.map((brand) => (
                    <div key={brand?.id} className="dropdown-content-list-item">
                      <li>{brand?.name}</li>
                      <p>{brand?.description}</p>
                    </div>
                  ))}
                </ul>
                <div className="view-all-container">
                  <p>Shop All Brands</p>
                  <button className="view-all-container-button">
                    Shop Now
                  </button>
                </div>
              </div>
            )}
          </li>
          {categories?.map((category) => (
            <li
              key={category?._id}
              onClick={() => handleCategoryClick(category)}
              style={{ cursor: "pointer" }}
            >
              {category?.name}
              <span className="arrow-icon"></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
