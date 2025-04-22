import React from "react";
import ProductTableHeader from "./ProductTableHeader";
import ProductTableRow from "./ProductTableRow";

const ProductTable = ({ products }) => (
  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <div className="pb-4 bg-white dark:bg-gray-900"></div>
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <ProductTableHeader />
      <tbody>
        {products?.map((product) => (
          <ProductTableRow key={product._id} product={product} />
        ))}
      </tbody>
    </table>
  </div>
);

export default ProductTable;
