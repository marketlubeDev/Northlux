import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

//components
import PageHeader from "../../components/Admin/PageHeader";
import ProductNameInput from "../../components/Admin/Product/components/Inputs/ProductNameInput";
import BrandSelect from "../../components/Admin/Product/components/Inputs/BrandSelect";
import CategorySelect from "../../components/Admin/Product/components/Inputs/CategrorySelect";
import UnitsSelect from "../../components/Admin/Product/components/Inputs/UnitsSelects";
import LabelSelect from "../../components/Admin/Product/components/Inputs/LabelSelect";
import VariantRadioButtons from "../../components/Admin/Product/components/Variants/VariantRadioButtons";
import VariantCard from "../../components/Admin/Product/components/Variants/VariantsCard";
import VariantForm from "../../components/Admin/Product/components/Forms/VariantForm";
import ErrorMessage from "../../components/common/ErrorMessage";
import ImageUploaderContainer from "../../components/Admin/Product/components/ImageUploader/ImageUploaderContainer";

//  validations
import { validateProduct } from "../../components/Admin/Product/components/Validations/ProductValidation";
import { validateVariant } from "../../components/Admin/Product/components/Validations/VariantValidation";

//  API services
import { getcategoriesbrands } from "../../sevices/adminApis";
import {
  addProduct,
  getProductById,
  updateProduct,
} from "../../sevices/ProductApis";

//  initial states
import {
  initialProductState,
  initialVariantState,
} from "../../components/Admin/Product/constants/initialStates";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";

function Addproduct() {
  // State Management
  const [productData, setProductData] = useState(initialProductState);
  const [currentVariant, setCurrentVariant] = useState(initialVariantState);
  const [selectedVariant, setSelectedVariant] = useState("noVariants");
  const [images, setImages] = useState([]);
  const [formUtilites, setFormUtilites] = useState({});
  const [showVariantForm, setShowVariantForm] = useState(true);
  const fileInputs = useRef([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errors, setErrors] = useState({});
  const [variantErrors, setVariantErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();
  const productId = location.state?.productId;

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoadingData(true);
      try {
        const res = await getProductById(productId);
        let hasVariants = false;
        let variants = [];
        console.log(res.data);

        if (res.data.variants.length > 0) {
          hasVariants = true;
          setSelectedVariant("hasVariants");
          setShowVariantForm(true);
          variants = res.data.variants.map((variant) => ({
            ...variant,
            _id: variant._id,
          }));
          setCurrentVariant(variants[0]);
          setImages(variants[0].images);
          setSelectedVariantIndex(0);
        } else {
          setImages(res.data.images);
        }

        const productData = {
          name: res.data.name,
          brand: res.data.brand._id,
          category: res.data.category._id,
          label: res.data.label._id,
          variants: variants,
          sku: !hasVariants ? res.data.sku : "",
          description: !hasVariants ? res.data.description : "",
          // units: res.data.units,
          price: !hasVariants ? res.data.price : "",
          offerPrice: !hasVariants ? res.data.offerPrice : "",
          stock: !hasVariants ? res.data.stock : "",
          images: !hasVariants ? res.data.images : [],
        };

        setProductData(productData);
      } catch (err) {
        toast.error("Failed to fetch product");
      } finally {
        setIsLoadingData(false);
      }
    };
    if (productId) {
      setEditMode(true);
      fetchProduct();
    }
  }, [productId]);
  // Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getcategoriesbrands();
        setFormUtilites(res.data);
      } catch (err) {
        toast.error("Failed to fetch categories and brands");
      }
    };
    fetchData();
  }, []);

  // Event Handlers
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    if (name === "title" || name === "description") {
      setCurrentVariant((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [name]: value,
        },
      }));
      // Clear the error for this field
      setVariantErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    } else {
      setCurrentVariant((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear the error for this field
      setVariantErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleRadioChange = (event) => {
    const value = event.target.value;
    setSelectedVariant(value);

    if (value === "noVariants") {
      setProductData((prev) => ({
        ...prev,
        variants: [],
      }));
      setImages(productData.images);
    } else if (value === "hasVariants") {
      // Create first variant from existing product data

      const firstVariant = {
        sku: productData.sku || "",
        attributes: {
          title: "",
          description: productData.description || "",
        },
        price: productData.price || "",
        offerPrice: productData.offerPrice || "",
        stock: productData.stock
          ? productData.stock.toString().toLowerCase()
          : "",
        stockStatus: "inStock",
        images: productData.images || [],
      };

      // Update product data with the new variant
      setProductData((prev) => ({
        ...prev,
        variants: [firstVariant],
        // Clear single product fields
        sku: "",
        description: "",
        price: "",
        offerPrice: "",
        stock: "",
        images: [],
      }));

      // Set the current variant and show form
      setCurrentVariant(firstVariant);
      setImages(firstVariant.images);
      setSelectedVariantIndex(0);
      setShowVariantForm(true);
    }

    // Clear all errors when switching variant types
    setErrors({});
    setVariantErrors({});
  };

  const handleClick = (index) => {
    if (fileInputs.current[index]) {
      fileInputs.current[index].click(index);
    }
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);

      // Update images in the appropriate place based on context
      if (selectedVariant === "hasVariants") {
        // If editing a variant, update its images
        if (selectedVariantIndex !== null) {
          setProductData((prev) => ({
            ...prev,
            variants: prev.variants.map((variant, i) =>
              i === selectedVariantIndex
                ? { ...variant, images: newImages }
                : variant
            ),
          }));
          // Also update currentVariant
          setCurrentVariant((prev) => ({
            ...prev,
            images: newImages,
          }));
        }
      } else {
        // If editing product images
        setProductData((prev) => ({
          ...prev,
          images: newImages,
        }));
      }
    }
  };


const handleSaveVariant = () => {

    console.log(productData, "productData");
    console.log(images, "images");
    const variantData = {
      _id: currentVariant._id,
      sku: currentVariant.sku,
      attributes: {
        title: currentVariant.attributes.title,
        description: currentVariant.attributes.description,
      },
      price: currentVariant.price,
      offerPrice: currentVariant.offerPrice,
      stock: currentVariant.stock,
      stockStatus: currentVariant.stockStatus,
      images: [...images],
    };
    console.log(variantData.stockStatus, "variantData");
    if(variantData.stockStatus === "outofstock" && variantData.stock > 0){
      toast.error("Stock cannot be greater than 0 when stock status is out of stock");
      return;
    }

    // Validate variant before saving
    const validationErrors = validateVariant(variantData);
    if (Object.keys(validationErrors).length > 0) {
      setVariantErrors(validationErrors);
      return;
    }

    if (selectedVariantIndex !== null) {
      // Update existing variant
      setProductData((prev) => ({
        ...prev,
        variants: prev.variants.map((variant, index) =>
          index === selectedVariantIndex ? variantData : variant
        ),
      }));
      toast.success("Variant updated successfully");
    } else {
      // Add new variant
      setProductData((prev) => ({
        ...prev,
        variants: [...prev.variants, variantData],
      }));
      toast.success("Variant added successfully");
    }

    // Keep the form open and current variant selected when saving the first variant
    if (productData.variants.length === 0) {
      setSelectedVariantIndex(0);
    } else {
      resetVariantForm();
      setShowVariantForm(false);
      setSelectedVariantIndex(null);
    }

    setVariantErrors({});
  };

  const resetVariantForm = () => {
    setCurrentVariant(initialVariantState);
    setImages([]);
  };

  const handleDeleteVariant = (index) => {
    // Get the variant being deleted
    const deletedVariant = productData.variants[index];

    // Remove the variant from productData
    setProductData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));

    // Check if the deleted variant is the current variant
    if (
      currentVariant.sku === deletedVariant.sku &&
      currentVariant.attributes.title === deletedVariant.attributes.title
    ) {
      // Reset current variant to initial state
      setCurrentVariant(initialVariantState);
      // Clear images
      setImages([]);
      // Hide the variant form
      setShowVariantForm(false);
      // Clear any variant errors
      setVariantErrors({});
    }
  };

  console.log(selectedVariant === "hasVariants", "selectedVariant");

  const handlePublish = async () => {
    // Check if variants are required but none are added
    if (
      selectedVariant === "hasVariants" &&
      productData.variants.length === 0
    ) {
      toast.error("Please add at least one variant before publishing");
      setErrors((prev) => ({
        ...prev,
        variants: "At least one variant is required",
      }));
      return;
    }

    // Pass images as third argument to validateProduct
    const validationErrors = validateProduct(
      productData,
      selectedVariant,
      images
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (validationErrors.variants) {
        toast.error(validationErrors.variants);
        if (validationErrors.variantErrors) {
          validationErrors.variantErrors.forEach((variantError, index) => {
            if (variantError) {
              const errorMessages = Object.values(variantError).join(", ");
              toast.error(`Variant ${index + 1}: ${errorMessages}`);
            }
          });
        }
      } else {
        toast.error("Please fill in all required fields");
      }
      return;
    }

    setIsPublishing(true);
    const formData = new FormData();

    // Add basic product info
    formData.append("name", productData.name);
    formData.append("brand", productData.brand);
    formData.append("category", productData.category);
    formData.append("label", productData.label);
    // formData.append("units", productData.units);

    if (selectedVariant === "hasVariants") {
      console.log(productData.variants, "productData.variants");
      // For products with variants
      const formattedVariants = productData.variants.map((variant) => {
        // Convert stock to number if it's a numeric string, otherwise use 0
        const stockNumber = variant.stock ? parseInt(variant.stock, 10) : 0;

        const variantData = {
          sku: variant.sku,
          attributes: {
            title: variant.attributes.title,
            description: variant.attributes.description,
          },
          price: variant.price,
          offerPrice: variant.offerPrice,
          stock: stockNumber, // Use the converted number
          stockStatus: variant.stockStatus.toLowerCase(), // Ensure correct enum case
        };

        if (variant._id) {
          variantData._id = variant._id;
        }

        return variantData;
      });

      // Append each variant separately
      formattedVariants.forEach((variant, variantIndex) => {
        if (variant._id) {
          formData.append(`variants[${variantIndex}][_id]`, variant._id);
        }

        formData.append(`variants[${variantIndex}][sku]`, variant.sku);
        formData.append(
          `variants[${variantIndex}][attributes][title]`,
          variant.attributes.title
        );
        formData.append(
          `variants[${variantIndex}][attributes][description]`,
          variant.attributes.description
        );
        formData.append(`variants[${variantIndex}][price]`, variant.price);
        formData.append(
          `variants[${variantIndex}][offerPrice]`,
          variant.offerPrice
        );
        formData.append(`variants[${variantIndex}][stock]`, variant.stock);
        formData.append(
          `variants[${variantIndex}][stockStatus]`,
          variant.stockStatus
        );

        // Handle images for this variant with indices
        if (productData.variants[variantIndex].images) {
          productData.variants[variantIndex].images.forEach(
            (image, imageIndex) => {
              if (image instanceof File) {
                formData.append(
                  `variants[${variantIndex}][images][${imageIndex}]`,
                  image
                );
              } else {
                formData.append(
                  `variants[${variantIndex}][images][${imageIndex}]`,
                  image
                );
              }
            }
          );
        }

      });

    } else {
      // For products without variants
      formData.append("description", productData.description);
      formData.append("sku", productData.sku);
      formData.append("price", productData.price);
      formData.append("offerPrice", productData.offerPrice);
      // Convert stock to number if it's a numeric string, otherwise use 0
      const stockNumber = productData.stock
        ? parseInt(productData.stock, 10)
        : 0;
      formData.append("stock", stockNumber);

      // Handle product images with indices
      images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append(`productImages[${index}]`, image);
        }
      });
    }

    try {
      let res;
      if (editMode && productId) {
        res = await updateProduct(productId, formData);
        if (res.status === 200) {
          toast.success("Product updated successfully");
          navigate("/admin/product");
        }
      } else {
        res = await addProduct(formData);
        if (res.status === 201) {
          toast.success("Product added successfully");
          navigate("/admin/product");
        }
      }
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(
          editMode ? "Failed to update product" : "Failed to add product"
        );
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCurrentVariant = (variant, index) => {
    setCurrentVariant(variant);
    setSelectedVariantIndex(index);
    setShowVariantForm(true);
    // Set the images from the selected variant
    setImages(variant.images || []);
  };

  const closeVariantForm = () => {
    setShowVariantForm(false);
    setCurrentVariant(initialVariantState);
    setImages([]);
    setSelectedVariantIndex(null);
  };

  return (
    <div className="space-y-3 w-full bg-white p-3 flex flex-col min-h-full">
      <PageHeader content={"Products"} />
      <h1 className="font-bold text-lg mb-2">
        {editMode ? "Edit Product" : "Add Product"}
      </h1>

      {editMode && isLoadingData ? (
        <LoadingSpinner fullScreen={true} />
      ) : (
        <div className="w-full flex justify-between">
          <div
            className={
              selectedVariant === "" ||
              (selectedVariant === "hasVariants" && !showVariantForm) ||
              (selectedVariant === "noVariants" && !showVariantForm)
                ? "w-full"
                : "w-1/2"
            }
          >
            <div className="space-y-4 bg-white py-3 px-5">
              <ProductNameInput
                handleChange={handleProductChange}
                value={productData.name}
                errors={errors}
              />

              <div className="flex gap-2">
                <BrandSelect
                  brands={formUtilites.brands}
                  handleChange={handleProductChange}
                  value={productData.brand}
                  errors={errors}
                />
                <CategorySelect
                  categories={formUtilites.categories}
                  handleChange={handleProductChange}
                  value={productData.category}
                  errors={errors}
                />
              </div>

              <div className="flex gap-2">
                {/* <UnitsSelect
                  handleChange={handleProductChange}
                  value={productData.units}
                  errors={errors}
                /> */}
                <LabelSelect
                  labels={formUtilites.labels}
                  handleChange={handleProductChange}
                  value={productData.label}
                  errors={errors}
                />
              </div>

              <VariantRadioButtons
                selectedVariant={selectedVariant}
                handleRadioChange={handleRadioChange}
              />
              <ErrorMessage error={errors?.variantSelection} />

              {productData.variants.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Saved Variants</h3>
                    {!showVariantForm && !isPublishing && (
                      <button
                        onClick={() => setShowVariantForm(true)}
                        className="btn bg-blue-600 text-white p-2 px-4 rounded-3xl flex items-center gap-2"
                      >
                        <span>+ Add Variant</span>
                      </button>
                    )}
                  </div>
                  <div
                    className={`${
                      showVariantForm ? "max-h-80" : ""
                    } overflow-auto pr-2`}
                  >
                    <div className="flex  flex-wrap gap-3">
                      {productData.variants.map((variant, index) => (
                        <VariantCard
                          key={index}
                          variant={{
                            ...variant,
                            variantNumber: index + 1,
                            title: variant.attributes.title,
                            // width: showVariantForm ? "max-w-64" : "w-full",
                          }}
                          editMode={editMode}
                          isSelected={selectedVariantIndex === index}
                          setCurrentVariant={() =>
                            handleCurrentVariant(variant, index)
                          }
                          handleDeleteVariant={() => handleDeleteVariant(index)}
                          currentVariant={currentVariant}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {selectedVariant === "noVariants" && (
            <div className="w-1/2 flex items-center">
              <div className="w-full space-y-3">
                <div className="flex gap-2 px-3">
                  <div className="flex flex-col w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={productData.sku}
                      onChange={handleProductChange}
                      className={`bg-gray-50 border ${
                        errors?.sku ? "border-red-500" : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    />
                    <ErrorMessage error={errors?.sku} />
                  </div>
                </div>
                <div className="flex gap-2 px-3">
                  <div className="flex flex-col w-1/2">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={productData.price}
                      onChange={handleProductChange}
                      className={`bg-gray-50 border ${
                        errors?.price ? "border-red-500" : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    />
                    <ErrorMessage error={errors?.price} />
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Offer Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="offerPrice"
                      value={productData.offerPrice}
                      onChange={handleProductChange}
                      className={`bg-gray-50 border ${
                        errors?.offerPrice
                          ? "border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    />
                    <ErrorMessage error={errors?.offerPrice} />
                  </div>
                </div>
                <div className="flex gap-2 px-3">
                  <div className="flex flex-col w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="stock"
                      value={productData.stock}
                      onChange={handleProductChange}
                      className={`bg-gray-50 border ${
                        errors?.stock ? "border-red-500" : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    />
                    <ErrorMessage error={errors?.stock} />
                  </div>
                </div>
                <div className="px-3">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={productData.description}
                    onChange={handleProductChange}
                    rows={6}
                    className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border ${
                      errors?.description ? "border-red-500" : "border-gray-300"
                    } focus:ring-blue-500 focus:border-blue-500`}
                  />
                  <ErrorMessage error={errors?.description} />
                </div>

                <ImageUploaderContainer
                  images={editMode ? productData.images : images}
                  handleClick={handleClick}
                  handleFileChange={handleFileChange}
                  fileInputs={fileInputs}
                  error={errors?.images}
                />
              </div>
            </div>
          )}

          {selectedVariant === "hasVariants" &&
            (showVariantForm || productData.variants.length === 0) && (
              <div className="w-1/2 flex items-center">
                <div className="w-full space-y-3">
                  {productData.variants.length > 0 && (
                    <div className="relative">
                      <div className="absolute top-0 right-3 z-10">
                        <button
                          onClick={() => closeVariantForm()}
                          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 px-3">
                    <div className="flex flex-col w-1/2">
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        SKU <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="sku"
                        value={currentVariant.sku}
                        onChange={handleVariantChange}
                        className={`bg-gray-50 border ${
                          variantErrors?.sku
                            ? "border-red-500"
                            : "border-gray-300"
                        } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      />
                      <ErrorMessage error={variantErrors?.sku} />
                    </div>
                    <div className="flex flex-col w-1/2">
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Variant Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={currentVariant.attributes.title}
                        onChange={handleVariantChange}
                        placeholder="Please enter variant title"
                        className={`bg-gray-50 border ${
                          variantErrors?.title
                            ? "border-red-500"
                            : "border-gray-300"
                        } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                      />
                      <ErrorMessage error={variantErrors?.title} />
                    </div>
                  </div>

                  <VariantForm
                    handleVariantChange={handleVariantChange}
                    currentVariantData={currentVariant}
                    errors={variantErrors}
                  />

                  <ImageUploaderContainer
                    images={
                      editMode && selectedVariantIndex !== null
                        ? currentVariant.images
                        : images
                    }
                    handleClick={handleClick}
                    handleFileChange={handleFileChange}
                    fileInputs={fileInputs}
                    error={variantErrors?.images}
                  />

                  <div className="w-full text-end">
                    <button
                      onClick={handleSaveVariant}
                      className="btn bg-blue-600 text-white p-1 px-3 rounded-3xl"
                    >
                      {editMode && currentVariant._id
                        ? "Update Variant"
                        : !editMode && selectedVariantIndex !== null
                        ? "Update Variant"
                        : "Save Variant"}
                    </button>
                  </div>
                </div>
              </div>
            )}
        </div>
      )}

      {!isLoadingData && (
        <div className="flex justify-center gap-4">
          <button
            className="btn bg-red-600 text-white p-1 px-3 w-full max-w-sm rounded-3xl"
            disabled={isPublishing}
            onClick={() => navigate("/admin/product")}
          >
            Cancel
          </button>
          <button
            className={`btn ${
              isPublishing ? "bg-gray-500" : "bg-green-600"
            } text-white p-1 px-3 w-full max-w-sm rounded-3xl flex items-center justify-center gap-2`}
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Publishing...</span>
              </>
            ) : editMode ? (
              "Update Product"
            ) : (
              "Publish Product"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default Addproduct;
