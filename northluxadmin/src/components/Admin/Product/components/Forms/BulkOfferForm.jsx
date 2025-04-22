import React, { useState } from "react";

export const BulkOfferForm = ({ onClose, isProductSelected }) => {
  const [offerType, setOfferType] = useState("Category");
  const [category, setCategory] = useState("");
  const [offerMetric, setOfferMetric] = useState("");
  const [offerValue, setOfferValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApplyOffer = () => {
    // Handle offer application logic here
    console.log({
      offerType,
      category,
      offerMetric,
      offerValue,
      startDate,
      endDate,
    });
    onClose();
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
              className="mt-1 block w-1/2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={offerType}
              onChange={(e) => setOfferType(e.target.value)}
            >
              <option value="Category">Category</option>
              {/* Add more options as needed */}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Choose a Category</option>
              {/* Add category options here */}
            </select>
          </div>
        </>
      )}

      <div className="flex gap-4">
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

      <div className="flex gap-4 justify-between">
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
