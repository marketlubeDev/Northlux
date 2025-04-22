import React, { useState } from "react";
import { useFetch } from "../../../../../hooks/useFetch";
import { toast } from "react-toastify";

export const BulkOfferForm = ({ onClose, isProductSelected }) => {
  const [offerType, setOfferType] = useState("category");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [offerMetric, setOfferMetric] = useState("");
  const [offerValue, setOfferValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApplyOffer = () => {
    console.log({
      offerType,
      category,
      brand,
      offerMetric,
      offerValue,
      startDate,
      endDate,
    });
    if (!offerType || !offerMetric || !offerValue || !startDate || !endDate) {
      toast.error("Please fill all the fields");
      return;
    }
    onClose();
    toast.success("Offer applied successfully");
  };

  const [brandAndCategoreis] = useFetch("/admin/getcategoriesbrands");

  const categories = brandAndCategoreis?.categories || [];
  const brands = brandAndCategoreis?.brands || [];

  const handleOfferTypeChange = (e) => {
    setOfferType(e.target.value);
    setCategory("");
    setBrand("");
  };

  const fieldsConfig = {
    category: [
      {
        label: "Category",
        value: category,
        onChange: setCategory,
        options: categories,
      },
    ],
    brand: [
      { label: "Brand", value: brand, onChange: setBrand, options: brands },
    ],
    brandCategory: [
      { label: "Brand", value: brand, onChange: setBrand, options: brands },
      {
        label: "Category",
        value: category,
        onChange: setCategory,
        options: categories,
      },
    ],
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add Bulk Offer</h2>
      <p className="text-sm text-gray-600 mb-6">
        Create a special offer for a category, brand, or a specific combination
        of both.
      </p>

      {!isProductSelected && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Offer Type
            </label>
            <select
              className="mt-1 block w-1/2 min-w-fit border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={offerType}
              onChange={handleOfferTypeChange}
            >
              <option value="category">Category</option>
              <option value="brand">Brand</option>
              <option value="brandCategory">
                Category of a Specific Brand
              </option>
            </select>
          </div>

          {/*----------- dynamic-fields----------- */}
          <div className="flex flex-col md:flex-row md:gap-4">
            {fieldsConfig[offerType].map(
              ({ label, value, onChange, options }) => (
                <div key={label} className="mb-4 w-full ">
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  >
                    <option value="">{`Choose a ${label}`}</option>
                    {options?.map((option) => (
                      <option key={option?._id} value={option?._id}>
                        {option?.name}
                      </option>
                    ))}
                  </select>
                </div>
              )
            )}
          </div>
        </>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="mb-4 w-full">
          <label className="block text-sm font-medium text-gray-700">
            Offer Metric
          </label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={offerMetric}
            onChange={(e) => setOfferMetric(e.target.value)}
          >
            <option value="">Choose Discount Type</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
            {/* Add more options as needed */}
          </select>
        </div>

        <div className="mb-4 w-full">
          <label className="block text-sm font-medium text-gray-700">
            Offer Value
          </label>
          <input
            type="text"
            placeholder="Enter Discount Value (in %)"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={offerValue}
            onChange={(e) => setOfferValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 ">
        <div className="mb-4 w-full">
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="mb-4 w-full">
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleApplyOffer}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          + Apply Offer
        </button>
      </div>
    </div>
  );
};
