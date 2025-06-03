import React, { useEffect, useState } from "react";
import { adminUtilities } from "../../sevices/adminApis";
import { addProduct } from "../../sevices/ProductApis";
import { toast } from "react-toastify";

function Addproduct() {
  // Local state for product and variants
  const [productName, setProductName] = useState("");
  const [variants, setVariants] = useState([
    {
      name: "",
      sku: "",
      mrp: "",
      offerPrice: "",
      costPrice: "",
      description: "",
      images: [null, null, null, null],
      stockStatus: "",
      stockQuantity: "00",
    },
  ]);
  const [activeVariant, setActiveVariant] = useState(0);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [labels, setLabels] = useState([]);
  const [showSubcategory, setShowSubcategory] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    brand: "",
    category: "",
    subcategory: "",
    store: "",
    label: "",
    activeStatus: true,
    priority: 0,
  });


  useEffect(() => {
    if (productData.category) {
      setShowSubcategory(categories.find(c => c._id === productData.category)?.subcategories);
    } else {
      setShowSubcategory([]);
    }
  }, [productData.category]);

  useEffect(() => {
    const fetchUtilities = async () => {
      try {
        const response = await adminUtilities();
        setBrands(response?.data.brands);
        setCategories(response?.data.categories);
        setSubcategories(response?.data.subcategories);
        setStores(response?.data.stores);
        setLabels(response?.data.labels);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Error fetching utilities");
      }
    };
    fetchUtilities();
  }, []);

  // Add new variant
  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        name: "",
        sku: "",
        mrp: "",
        offerPrice: "",
        costPrice: "",
        description: "",
        images: [null, null, null, null],
        stockStatus: "",
        stockQuantity: "00",
      },
    ]);
    setActiveVariant(variants.length);
  };

  // Handle variant field change
  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setVariants((prev) =>
      prev.map((v, i) =>
        i === activeVariant ? { ...v, [name]: value } : v
      )
    );
  };

  // Handle image upload (UI only)
  const handleImageChange = (idx, file) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === activeVariant
          ? {
              ...v,
              images: v.images.map((img, j) => (j === idx ? file : img)),
            }
          : v
      )
    );
  };

  // Handle stock status checkbox
  const handleStockStatus = (status) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === activeVariant ? { ...v, stockStatus: status } : v
      )
    );
  };

  // Handle stock quantity
  const handleStockQuantity = (e) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === activeVariant ? { ...v, stockQuantity: e.target.value } : v
      )
    );
  };

  // Handle tab click
  const handleTabClick = (idx) => {
    setActiveVariant(idx);
  };

  // Remove a variant
  const handleRemoveVariant = (idx) => {
    if (variants.length === 1) return; // Don't allow removing last variant
    const newVariants = variants.filter((_, i) => i !== idx);
    let newActive = activeVariant;
    if (idx === activeVariant) {
      newActive = 0;
    } else if (idx < activeVariant) {
      newActive = activeVariant - 1;
    }
    setVariants(newVariants);
    setActiveVariant(newActive);
  };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePublishProduct = async () => {
    const formData = new FormData();

    // Product-level fields
    Object.entries(productData).forEach(([key, value]) => {
      // Only append if value is not undefined or null
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    formData.append("isDeleted", false);

    // Variants
    variants.forEach((v, variantIndex) => {
      formData.append(`variants[${variantIndex}][sku]`, v.sku);
      formData.append(`variants[${variantIndex}][price]`, v.mrp);
      formData.append(`variants[${variantIndex}][offerPrice]`, v.offerPrice);
      formData.append(`variants[${variantIndex}][stock]`, v.stockQuantity);
      formData.append(`variants[${variantIndex}][stockStatus]`, v.stockStatus);
      formData.append(`variants[${variantIndex}][grossPrice]`, v.costPrice);
      formData.append(`variants[${variantIndex}][offer]`, ""); // or v.offer if you have it

      // Attributes
      formData.append(`variants[${variantIndex}][attributes][title]`, v.name);
      formData.append(`variants[${variantIndex}][attributes][description]`, v.description);

      // Images (skip nulls)
      v.images.forEach((img, imgIdx) => {
        if (img) {
          formData.append(`variants[${variantIndex}][images][${imgIdx}]`, img);
        }
      });
    });

    // For demonstration, log all FormData entries
    try {
      const response = await addProduct(formData);
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error publishing product");
    }
  };

  return (
    <div className="space-y-3 w-full bg-white p-8 flex flex-col min-h-full">
      <div className="shadow p-4 rounded-lg border">
        <h2 className="font-bold text-xl mb-2">Products</h2>
        <h3 className="font-semibold text-lg mb-4">Add Product</h3>
     
        <div className="mb-4">
          <div className="flex items-center justify-between gap-6">
          <label className="block mb-1 font-medium">Product Name <span className="text-red-500">*</span></label>

          <div className="mb-4 flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="activeStatus"
              checked={!!productData.activeStatus}
              onChange={handleProductChange}
              className="accent-blue-600"
            />
            <span>Is Active</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="priority"
              checked={!!productData.priority}
              onChange={e => setProductData(prev => ({ ...prev, priority: e.target.checked ? 1 : 0 }))}
              className="accent-blue-600"
            />
            <span>Mark as Priority</span>
          </label>
        </div>
          </div>
          <input
            type="text"
            name="name"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={productData.name}
            onChange={handleProductChange}
            placeholder=""
          />
        </div>

        {/* Brand, Category, Subcategory */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Brand</label>
            <select
              name="brand"
              value={productData?.brand}
              onChange={handleProductChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option>Select Brand</option>
              {brands?.map((brand) => (
                <option key={brand._id} value={brand._id}>{brand.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">Category</label>
            <select className="w-full border rounded-lg px-3 py-2" name="category" value={productData.category} onChange={handleProductChange}>
              <option>Select Category</option>
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">Subcategory</label>
            <select className="w-full border rounded-lg px-3 py-2" name="subcategory" value={productData.subcategory} onChange={handleProductChange}>
              <option>Select Subcategory</option>
              {showSubcategory?.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Store, Label */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Store</label>
            <select className="w-full border rounded-lg px-3 py-2" name="store" value={productData.store} onChange={handleProductChange}>
              <option>Select Store</option>
              {stores.map((store) => (
                <option key={store._id} value={store._id}>{store.store_name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">Label</label>
            <select className="w-full border rounded-lg px-3 py-2" name="label" value={productData.label} onChange={handleProductChange}>
              <option>Select Label</option>
              {labels.map((label) => (
                <option key={label._id} value={label._id}>{label.name}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Variant Tabs */}
        <div className="flex gap-2 mb-4 items-center flex-wrap">
          {variants.map((v, idx) => (
            <div key={idx} className="flex items-center">
              <button
                className={`flex items-center gap-1 px-4 py-1 rounded-md border text-sm font-medium transition-colors
                  ${activeVariant === idx
                    ? "bg-teal-500 text-black border-teal-500"
                    : "bg-white text-black border-teal-400 hover:bg-teal-50"}
                `}
                onClick={() => handleTabClick(idx)}
                type="button"
              >
                Variant {idx + 1}
                {variants.length > 1 && (
                  <span
                    onClick={e => { e.stopPropagation(); handleRemoveVariant(idx); }}
                    className="ml-1 cursor-pointer text-red-500 hover:text-red-700 text-base"
                    title="Remove Variant"
                  >
                    &#10005;
                  </span>
                )}
              </button>
            </div>
          ))}
          <button
            className="px-3 py-1 rounded-md border border-teal-400 text-teal-500 bg-white hover:bg-teal-50 flex items-center justify-center text-lg font-bold"
            onClick={handleAddVariant}
            type="button"
            style={{ minWidth: '2.25rem', minHeight: '2.25rem' }}
          >
            +
          </button>
        </div>
        {/* Variant Form */}
        <div className="flex gap-8">
          {/* Left: Variant fields */}
          <div className="flex-1 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium">Variant name</label>
                <input
                  type="text"
                  name="name"
                  value={variants[activeVariant].name}
                  onChange={handleVariantChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g., 4k resolution"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={variants[activeVariant].sku}
                  onChange={handleVariantChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g., #2586312f9"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium">MRP</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                  <input
                    type="number"
                    name="mrp"
                    value={variants[activeVariant].mrp}
                    onChange={handleVariantChange}
                    className="w-full border rounded-lg px-8 py-2"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">Offer price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                  <input
                    type="number"
                    name="offerPrice"
                    value={variants[activeVariant].offerPrice}
                    onChange={handleVariantChange}
                    className="w-full border rounded-lg px-8 py-2"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">Cost price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                  <input
                    type="number"
                    name="costPrice"
                    value={variants[activeVariant].costPrice}
                    onChange={handleVariantChange}
                    className="w-full border rounded-lg px-8 py-2"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Right: Images, Description, Stock */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block mb-1 font-medium">Variant Images</label>
              <div className="flex gap-4">
                {[0, 1, 2, 3].map((idx) => (
                  <label
                    key={idx}
                    className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition"
                  >
                    {variants[activeVariant].images[idx] ? (
                      <img
                        src={URL.createObjectURL(variants[activeVariant].images[idx])}
                        alt="variant"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <span className="text-3xl text-gray-300">📷</span>
                        <span className="text-xs text-gray-400 mt-2">Add</span>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageChange(idx, e.target.files[0])}
                    />
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Variant Description</label>
              <textarea
                name="description"
                value={variants[activeVariant].description}
                onChange={handleVariantChange}
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                placeholder="Write your thoughts here..."
              />
            </div>
            <div className="flex gap-4 items-end">
              <div className="flex flex-col gap-2">
                <label className="block mb-1 font-medium">Stock Status</label>
                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={variants[activeVariant].stockStatus === "instock"}
                      onChange={() => handleStockStatus("instock")}
                    />
                    <span>In stock</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={variants[activeVariant].stockStatus === "outofstock"}
                      onChange={() => handleStockStatus("outofstock")}
                    />
                    <span>Out of Stock</span>
                  </label>
                </div>
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">Stock Quantity</label>
                <input type="number" className="w-full border rounded-lg px-3 py-2" value={variants[activeVariant].stockQuantity} onChange={handleStockQuantity} />
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Buttons */}
        <div className="flex justify-between mt-8">
          <button className="bg-red-600 text-white px-8 py-2 rounded-full font-semibold">Cancel</button>
          <div className="flex gap-4">
            <button
              className="bg-green-700 text-white px-8 py-2 rounded-full font-semibold"
              onClick={handlePublishProduct}
            >
              Publish Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Addproduct;
