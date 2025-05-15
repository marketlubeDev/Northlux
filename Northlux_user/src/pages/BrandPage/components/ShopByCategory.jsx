import React, { useState } from "react";
import { useProducts } from "../../../hooks/queries/products";
import Card from "../../../components/Card";
import Pagination from "../../../components/Pagination";
import { useCategories } from "../../../hooks/queries/categories";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ShopByCategory = ({ id }) => {
  const [activeTab, setActiveTab] = useState("");

  const { data, isLoading, error } = useProducts({
    brandId: id,
    categoryId: activeTab,
  });
  const { data: categories } = useCategories({brandId: id});



  // const categories = ["sholder bags", "t-shirts", "shoes", "bags", "sneakers"];

const allCategories = categories?.envelop?.data || [];

console.log(allCategories , "allCategories");



  return (
    <section className="shop-by-category">
      <h2>
        Shop By <span className="shop-by-category-span">Category</span>
      </h2>
      <div className="tabs">
        {allCategories.map((category, index) => (
          <button
            key={index}
            className={`tab-btn ${activeTab === category._id ? "active" : ""}`}
            onClick={() => setActiveTab(category._id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      { isLoading ? <LoadingSpinner /> : data?.data?.products?.length > 0 ? (
        <div className="content">
          {data?.data?.products?.map((product, index) => (
            <Card product={product} key={index} />
          ))}
        </div>
      ) : (
        <div>No products found</div>
      )}

      {/* {data?.data?.products?.length > 0 && (
        <div className="pagination">
          <Pagination />
        </div>
      )} */}

      {/* </div> */}
      {/* <div className="shop-all">
        <p>Discover More from The Collection.</p>
        <a href="#">shop all →</a>
      </div> */}
    </section>
  );
};

export default ShopByCategory;
