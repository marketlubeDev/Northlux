import React from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProductTableRow = ({
  product,
  selectedProducts,
  setSelectedProducts,
  role,
}) => {
  const navigate = useNavigate();

  const handleEdit = (id) => {
    if (role === "store") {
      navigate(`/store/product/addproduct`, { state: { productId: id } });
    } else {
      navigate(`/admin/product/addproduct`, { state: { productId: id } });
    }
  };

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setSelectedProducts((prev) => [...prev, product._id]);
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== product._id));
    }
  };

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
      <td className="w-4 p-4">
        <div className="flex items-center">
          <input
            id={`checkbox-table-search-${product._id}`}
            type="checkbox"
            checked={selectedProducts?.includes(product._id)}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor={`checkbox-table-search-${product._id}`}
            className="sr-only"
          >
            checkbox
          </label>
        </div>
      </td>
      <th
        scope="row"
        className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center gap-2 cursor-pointer"
        title={product?.name}
      >
        <span
          className={`w-2 h-2 block rounded-full ${
            product?.priority && "bg-green-500"
          }`}
          title={product?.priority ? "Priority Product" : ""}
        ></span>
        {product?.name?.split("").length > 30
          ? product?.name?.split(" ").slice(0, 4).join(" ") + "..."
          : product?.name}
      </th>
      <td className="px-6 py-4">{product?.brand?.name}</td>
      <td className="px-6 py-4">{product?.category?.name}</td>
      <td className="px-6 py-4 ">
        {product?.activeStatus ? (
          <span className="bg-green-500 text-white px-2 py-1 rounded-md w-16 inline-block text-center">
            Active
          </span>
        ) : (
          <span className="bg-red-500 text-white px-2 py-1 rounded-md w-16 inline-block text-center">
            Inactive
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        {new Date(product?.updatedAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4">
        <FaEdit
          className="w-5 h-5 text-blue-600 cursor-pointer"
          onClick={() => handleEdit(product?._id)}
        />
      </td>
    </tr>
  );
};

export default ProductTableRow;
