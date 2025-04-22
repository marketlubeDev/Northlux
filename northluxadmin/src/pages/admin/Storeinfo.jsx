import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import PageHeader from "../../components/Admin/PageHeader";

function Storeinfo() {
  const [selectedStore, setSelectedStore] = useState("Sample store, Calicut");

  // Sample data for statistics
  const statistics = {
    totalSales: 1280,
    monthlyRevenue: 34351,
    profit: 20351,
    totalItemValue: 56780,
  };

  // Sample data for products
  const products = Array(8).fill({
    image: "/placeholder-product.jpg",
    name: "Sample product name",
    brand: "Brand Name",
    stock: "150 left",
    grossPrice: "₹480",
    sellingPrice: "₹640",
    offerPrice: "₹680",
    lastUpdated: "25 Mar 2025",
  });

  return (
    <>
      <PageHeader content="Store Information" />
      <div className="bg-gray-50 min-h-screen p-6">
        {/* Store Info Header */}
        {/* Store Selection Card */}
        <div className="bg-white rounded-lg mb-4">
          <div className="px-4 py-3">
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-64 p-2 border border-gray-200 rounded text-sm focus:outline-none"
            >
              <option>Sample store, Calicut</option>
            </select>
          </div>
        </div>

        {/* Store Details Card */}
        <div className="bg-white rounded-lg mb-4">
          <div className="px-4 py-3">
            {/* Store Information */}
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-20">Store Name</span>
                <span className="text-gray-500 mx-2">:</span>
                <span>Sample store, Calicut</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-20">Email address</span>
                <span className="text-gray-500 mx-2">:</span>
                <span>storesample@gmail.com</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-20">Contact</span>
                <span className="text-gray-500 mx-2">:</span>
                <span>9856 9569 999</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-20">Created on</span>
                <span className="text-gray-500 mx-2">:</span>
                <span>Mar 24,2024</span>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="bg-emerald-50/40 p-3 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Sales</span>
                  <IoMdInformationCircleOutline className="text-gray-400 text-lg" />
                </div>
                <div className="mt-1.5">
                  <span className="text-lg font-medium">
                    {statistics.totalSales}
                  </span>
                  <span className="text-emerald-500 text-xs ml-1">+5%</span>
                </div>
              </div>
              <div className="bg-amber-50/40 p-3 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly Revenue</span>
                  <IoMdInformationCircleOutline className="text-gray-400 text-lg" />
                </div>
                <div className="mt-1.5">
                  <span className="text-lg font-medium">
                    ₹{statistics.monthlyRevenue}
                  </span>
                  <span className="text-amber-500 text-xs ml-1">+5%</span>
                </div>
              </div>
              <div className="bg-purple-50/40 p-3 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profit</span>
                  <IoMdInformationCircleOutline className="text-gray-400 text-lg" />
                </div>
                <div className="mt-1.5">
                  <span className="text-lg font-medium">
                    ₹{statistics.profit}
                  </span>
                  <span className="text-purple-500 text-xs ml-1">+5%</span>
                </div>
              </div>
              <div className="bg-red-50/40 p-3 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Total item value
                  </span>
                  <IoMdInformationCircleOutline className="text-gray-400 text-lg" />
                </div>
                <div className="mt-1.5">
                  <span className="text-lg font-medium">
                    ₹{statistics.totalItemValue}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg">
          <div className="p-4">
            {/* Search and Add */}
            <div className="flex justify-between items-center mb-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search by product name, SKU..."
                  className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded text-sm focus:outline-none"
                />
              </div>
              <button className="px-3 py-2 bg-emerald-500 text-white rounded text-sm">
                + Add Product
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-emerald-50/30">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Product Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Brand
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Stock
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Gross Price
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Selling Price
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Offer Price
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Last Updated on
                    </th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-6 h-6 rounded object-cover"
                            />
                          </div>
                          <span className="text-sm">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{product.brand}</td>
                      <td className="py-3 px-4 text-sm">{product.stock}</td>
                      <td className="py-3 px-4 text-sm">
                        {product.grossPrice}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {product.sellingPrice}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {product.offerPrice}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {product.lastUpdated}
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M2 4h12M6 4V2h4v2M4 4l1 10h6l1-10"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Storeinfo;
