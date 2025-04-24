import React, { useState, useRef } from "react";
import { useFetch } from "../../../../../hooks/useFetch";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";

export const BulkOfferForm = ({ onClose, isProductSelected }) => {
  // const [offerType, setOfferType] = useState(isProductSelected ? "group" : "category");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  // const [offerMetric, setOfferMetric] = useState("");
  // const [offerValue, setOfferValue] = useState("");
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
  // const [offerName, setOfferName] = useState("");
  // const [bannerImage, setBannerImage] = useState("");

  const [formData, setFormData] = useState({
    offerType: isProductSelected ? "group" : "category",
    offerName: "",
    category: "",
    brand: "",
    offerMetric: "",
    offerValue: "",
    startDate: "",
    endDate: "",
    bannerImage: "",
  });

  console.log(formData, "================formData");

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handle apply offer
  const handleApplyOffer = () => {
    // if (!offerType || !offerMetric || !offerValue || !startDate || !endDate) {
    //   toast.error("Please fill all the fields");
    //   return;
    // }
    onClose();
    toast.success("Offer applied successfully");
  };

  const [brandAndCategoreis] = useFetch("/admin/getcategoriesbrands");

  const categories = brandAndCategoreis?.categories || [];
  const brands = brandAndCategoreis?.brands || [];

  // const handleOfferTypeChange = (e) => {
  //   setOfferType(e.target.value);
  //   setCategory("");
  //   setBrand("");
  // };

  const fieldsConfig = {
    category: [
      {
        label: "Category",
        value: category,
        // onChange: setCategory,
        options: categories,
      },
    ],
    brand: [{ label: "Brand", value: brand, options: brands }],
    brandCategory: [
      { label: "Brand", value: brand, options: brands },
      {
        label: "Category",
        value: category,
        options: categories,
      },
    ],
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));
    setFormData({ ...formData, bannerImage: file });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add Bulk Offer</h2>
      <p className="text-sm text-gray-600 mb-6">
        Create a special offer for a category, brand, or a specific combination
        of both.
      </p>

      {/*----------- offerName----------- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Offer Name
          </label>
          <input
            type="text"
            className="mt-1  block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="eg. Onam Offer"
            name="offerName"
            value={formData.offerName}
            onChange={handleInputChange}
          />
        </div>

        {/*----------- offerType----------- */}
        {!isProductSelected && (
          <div className="w-full mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Offer Type
            </label>
            <select
              className="mt-1 block w-1/2 min-w-fit border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.offerType}
              name="offerType"
              onChange={(e) => {
                // handleOfferTypeChange(e);
                // setFormData({ ...formData, offerType: e.target.value });
                handleInputChange(e);
              }}
            >
              <option value="category">Category</option>
              <option value="brand">Brand</option>
              <option value="brandCategory">
                Category of a Specific Brand
              </option>
            </select>
          </div>
        )}
      </div>

      {/*----------- dynamic-fields----------- */}
      {!isProductSelected && (
        <div className="flex flex-col md:flex-row md:gap-4">
          {fieldsConfig[formData.offerType].map(
            ({ label, value, onChange, options }) => (
              <div key={label} className="mb-4 w-full ">
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  // value={value}
                  // onChange={(e) => onChange(e.target.value)}
                  name={label}
                  value={formData[value]}
                  onChange={(e) => {
                    handleInputChange(e);
                    // setFormData({ ...formData, [label]: e.target.value });
                    // setOfferType(e.target.value);
                  }}
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
      )}


      {/* ----------- offerMetric and offerValue----------- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="mb-4 w-full">
          <label className="block text-sm font-medium text-gray-700">
            Offer Metric
          </label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            name="offerMetric"
            value={formData.offerMetric}
            onChange={handleInputChange}
          >
            <option value="">Choose Discount Type</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
            {/* Add more options as needed */}
          </select>
        </div>

      {/* ----------- offerValue----------- */}
      <div className="mb-4 w-full">
        <label className="block text-sm font-medium text-gray-700">
          Offer Value
          </label>
          <input
            type="number"
            placeholder="Enter Discount Value (in %)"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.offerValue}
            name="offerValue"
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* ----------- startDate and endDate----------- */}
      <div className="flex flex-col sm:flex-row gap-4 ">
        <div className="mb-4 w-full">
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.startDate}
            name="startDate"
            onChange={handleInputChange}
          />
        </div>

        {/* ----------- endDate----------- */}
        <div className="mb-4 w-full">
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.endDate}
            name="endDate"
            onChange={handleInputChange}
          />
        </div>
      </div>


      {/* ----------- bannerImage----------- */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brand Image
        </label>
        <div
          onClick={handleImageClick}
          className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          {imagePreview ? (
            <div className="relative w-full h-full">
              <img
                src={imagePreview}
                alt="Brand preview"
                className="w-full h-full object-contain rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <FaCamera className="text-white text-3xl" />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <FaCamera className="mx-auto text-gray-400 text-3xl mb-2" />
              <p className="text-gray-500">Click to upload image</p>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          name="bannerImage"
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
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
