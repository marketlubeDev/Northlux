import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { listProducts, searchProducts } from "../../sevices/ProductApis";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

import PageHeader from "../../components/Admin/PageHeader";
import ProductTable from "../../components/Admin/Product/components/Table/ProductTable";
import Pagination from "../../components/Admin/Product/components/Pagination/Pagination";
import { Modal } from "../../components/shared/Modal";
import { BulkOfferForm } from "../../components/Admin/Product/components/Forms/BulkOfferForm";

function Products({ role }) {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  const [showBulkOfferModal, setShowBulkOfferModal] = useState(false);
  const [isProductSelected, setIsProductSelected] = useState(false);
  const selectedProductsCount = selectedProducts?.length;

  // console.log("selectedProducts==========", selectedProducts);

  // handleIsProductSelected
  useEffect(() => {
    const handleIsProductSelected = () => {
      if (selectedProducts.length > 0) {
        setIsProductSelected(true);
      } else {
        setIsProductSelected(false);
      }
    };
    handleIsProductSelected();
  }, [selectedProducts]);

  // Fetch products when page changes or on initial load
  useEffect(() => {
    if (searchKeyword) {
      performSearch(searchKeyword, currentPage);
    } else {
      fetchProducts(currentPage);
    }
  }, [currentPage]); // Add currentPage as dependency

  const fetchProducts = async (page) => {
    try {
      setIsLoading(true);
      const res = await listProducts(page, role);
      setProducts(res?.data?.data?.products);
      setTotalPages(res?.data?.data?.totalPages);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (keyword) => {
      if (!keyword.trim()) {
        fetchProducts(currentPage);
        return;
      }

      try {
        setIsLoading(true);
        const res = await searchProducts({
          keyword,
          page: currentPage,
          limit: 10,
        });
        setProducts(res?.data?.data?.products);
        setIsProductSelected(false);
        setSelectedProducts([]);
        setTotalPages(res?.data?.data?.totalPages);
      } catch (err) {
        toast.error("Failed to search products");
      } finally {
        setIsLoading(false);
      }
    }, 1000),
    [currentPage]
  );

  // Handle search input changes
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    setCurrentPage(1); // Reset to first page on new search
    debouncedSearch(value);
  };

  // Perform search with pagination
  const performSearch = async (keyword, page) => {
    try {
      setIsLoading(true);
      const res = await searchProducts({
        keyword,
        page,
        limit: 10,
      });
      setProducts(res?.data?.data?.products);
      setTotalPages(res?.data?.data?.totalPages);
    } catch (err) {
      toast.error("Failed to search products");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedProducts([]);
    setIsProductSelected(false);
  };

  // Handle All products checkbox selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map((product) => product._id));
      setIsProductSelected(true);
    } else {
      setSelectedProducts([]);
      setIsProductSelected(false);
    }
  };

  // Cleanup debounce on component unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 relative">
      <PageHeader content="Products" />

      <div className="flex flex-col  m-4">
        <div className="relative overflow-hidden shadow-md sm:rounded-lg flex flex-col flex-1 bg-white">
          {/* Header section with Add Product button and Search */}
          <div className="flex items-center justify-between flex-wrap md:flex-row p-4 border-b">
            {/* search-bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchKeyword}
                onChange={handleSearchInput}
                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search products..."
              />
            </div>
            {/* buttons */}
            <div className="flex gap-2">
              {isProductSelected && (
                <button className="font-semibold text-red-500 p-2 rounded-md hover:bg-red-500 hover:text-white transition-colors">
                  x Remove Offer
                </button>
              )}
              <button
                onClick={() => setShowBulkOfferModal(true)}
                className="border-2 border-green-500 text-green-500 p-2 rounded-md hover:bg-green-500 hover:text-white transition-colors"
              >
                + Add Bulk Offer
              </button>
              {!isProductSelected && (
                <button
                  onClick={() => navigate("addproduct")}
                  className="bg-green-500 p-2 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  + Add Product
                </button>
              )}
            </div>
          </div>

          <Modal
            isOpen={showBulkOfferModal}
            onClose={() => setShowBulkOfferModal(false)}
          >
            <BulkOfferForm isProductSelected={isProductSelected} />
          </Modal>

          {/* Table section with loading state */}
          <div className="overflow-y-auto flex-1 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <LoadingSpinner color="primary" text="Loading..." fullScreen />
              </div>
            )}
            {!isLoading && products?.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No products found
              </div>
            ) : (
              <ProductTable
                products={products}
                onSelectAll={handleSelectAll}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                isProductSelected={isProductSelected}
                selectedProductsCount={selectedProductsCount}
                role={role}
              />
            )}
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="sticky bottom-0 flex items-center justify-between p-4 bg-white border-t">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page {currentPage} of {totalPages}
                </p>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
