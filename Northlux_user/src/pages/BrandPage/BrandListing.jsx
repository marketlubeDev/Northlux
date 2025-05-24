import React, { useState, useEffect, useCallback, useRef } from "react";
import debounce from "lodash/debounce";
import { useBrands } from "../../hooks/queries/brands";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { FiSearch } from "react-icons/fi";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";

export const BrandListing = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  console.log(currentPage, "currentPage");
  const [limit, setLimit] = useState(12);
  // const [brands, setBrands] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search handler for API call
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 500),
    []
  );

  // Add pagination handler
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  //? Focus the input field after searchQuery is updated
  // useEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // }, [searchQuery]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const {
    data: brandsData,
    isLoading: brandsLoading,
    isError: brandsError,
  } = useBrands({ search: searchQuery, page: currentPage, limit: limit });

  const totalPages = brandsData?.totalPages;

  const brands = brandsData?.data?.brands || [];
  // useEffect(() => {
  //   setBrands(brandsData?.data?.brands);
  // }, [brandsData]);

  //handle loading states
  if (brandsLoading) {
    return <LoadingSpinner />;
  }
  // Handle error states
  if (brandsError) {
    return <div>Error loading content</div>;
  }

  return (
    <main className="brand-listing-page">
      <div>
        <Breadcrumbs
          breadcrumbItems={["Home", "All Brands"]}
          BreadcrumbLinks={["/", "/brands"]}
        />

        <div className="brand-listing-header">
          <div className="brand-listing-header-title">
            <h2>
              All <span>Brands</span>{" "}
              <span className="count">({brandsData?.results})</span>
            </h2>
          </div>

          {/* Desktop Search */}
          {/* <div className=" desktop-search brand-listing-search"> */}
          <div className=" brand-listing-search">
            <input
              type="text"
              placeholder="Search by brand name"
              value={inputValue}
              onChange={handleInputChange}
              className="search-input"
              ref={inputRef}
              // autoFocus={true}
            />
          </div>
          {/* </div> */}
        </div>
      </div>
      <div className="brand-listing-container">
        {brands?.map((brand, index) => (
          <div key={index} className="brand-listing-item">
            <img src={brand?.image} alt={brand?.name} />
            <div className="overlay">
              {/* <h3 className="brand-name">{brand?.name}</h3> */}
              <button
                onClick={() => {
                  navigate(`/brands/${brand?._id}`);
                }}
                className="explore-button"
              >
                Explore
              </button>
            </div>
            <p>{brand?.description}</p>
          </div>
        ))}
      </div>

      {/* Add Pagination */}
      {/* {brandsData?.results > limit && ( */}
      <div className="pagination-wrapper">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      {/* )} */}
    </main>
  );
};
