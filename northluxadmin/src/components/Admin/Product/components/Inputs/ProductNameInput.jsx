import React from "react";
import ErrorMessage from "../../../../common/ErrorMessage";

const ProductNameInput = ({ handleChange, value, errors }) => (
  <div className="mb-5">
    <label className="block mb-2 text-sm font-medium text-gray-900">
      ProductName <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      name="name"
      id="name"
      className={`bg-gray-50 border ${
        errors?.name ? "border-red-500" : "border-gray-300"
      } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
      onChange={handleChange}
      value={value}
    />
    <ErrorMessage error={errors?.name} />
  </div>
);

export default ProductNameInput;
