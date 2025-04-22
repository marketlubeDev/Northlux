import React, { useState, useRef, useEffect } from "react";
import PageHeader from "../../components/Admin/PageHeader";
import { FaTrash, FaEdit, FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import { addOfferBanner, editOfferBanner, deleteOfferBanner, getOfferBanners } from "../../sevices/OfferBannerApis";
import ConfirmationModal from "../../components/Admin/ConfirmationModal";
import { validateOfferBannerField, validateOfferBannerForm } from "../../utils/validations/offerBannerValidation";

function OfferBanner() {
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    offerValue: "",
    offerType: "",
    link: "",
    image: null,
  });
  const fileInputRef = useRef(null);
  const [offerBanners, setOfferBanners] = useState([]);
  const [errors, setErrors] = useState({
    title: '',
    image: '',
    description: '',
    offerValue: '',
    link: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchOfferBanners();
  }, []);

  const fetchOfferBanners = async () => {
    try {
      const data = await getOfferBanners();
      console.log(data);
      setOfferBanners(data?.data);
    } catch (error) {
      toast.error("Failed to fetch offer banners");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validateOfferBannerField(name, value, formData.offerType, imagePreview, !!editingBanner);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateOfferBannerForm(formData, imagePreview, !!editingBanner);

    if (Object.values(newErrors).some(error => error !== '')) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("subtitle", formData.subtitle);
      formDataObj.append("description", formData.description);
      formDataObj.append("offerValue", formData.offerValue);
      formDataObj.append("offerType", formData.offerType);
      formDataObj.append("link", formData.link);
      if (formData.image) {
        formDataObj.append("image", formData.image);
      }

      if (editingBanner) {
        await editOfferBanner(editingBanner._id, formDataObj);
        toast.success("Offer banner updated successfully");
      } else {
        await addOfferBanner(formDataObj);
        toast.success("Offer banner added successfully");
      }

      fetchOfferBanners();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      offerValue: banner.offerValue,
      offerType: banner.offerType,
      link: banner.link,
      image: null,
    });
    setImagePreview(banner.image);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      offerValue: "",
      offerType: "",
      link: "",
      image: null,
    });
    setImagePreview(null);
    setEditingBanner(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    resetForm();
  };

  const handleDeleteBanner = (banner) => {
    setBannerToDelete(banner);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setBannerToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!bannerToDelete) return;

    setIsDeleting(true);
    try {
      await deleteOfferBanner(bannerToDelete._id);
      toast.success("Offer banner deleted successfully");
      fetchOfferBanners();
      handleCloseDeleteModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete offer banner");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageHeader content="Offer Banner" />
      <div>
        <button
          className="block text-white bg-green-500 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center ms-auto mb-2"
          onClick={() => setShowModal(true)}
        >
          Add New Offer Banner
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {offerBanners.length > 0 ? (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-16 py-3">Image</th>
                <th scope="col" className="px-6 py-3">Title</th>
                <th scope="col" className="px-6 py-3">Subtitle</th>
                <th scope="col" className="px-6 py-3">Offer</th>
                <th scope="col" className="px-6 py-3">Link</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {offerBanners.map((banner) => (
                <tr key={banner._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="p-4">
                    <img src={banner.image} className="w-16 md:w-32  max-w-full max-h-full object-contain md:h-20" alt={banner.title} />
                  </td>
                  <td className="px-6 py-4 font-semibold">{banner.title}</td>
                  <td className="px-6 py-4">{banner.subtitle}</td>
                  <td className="px-6 py-4">{banner.offerValue}{banner.offerType === 'percentage' ? '%' : ' OFF'}</td>
                  <td className="px-6 py-4">{banner.link}</td>
                  <td className="px-6 py-10 flex gap-2">
                    <FaTrash className="text-red-500 text-lg cursor-pointer" onClick={() => handleDeleteBanner(banner)} />
                    <FaEdit className="text-blue-500 text-lg cursor-pointer" onClick={() => handleEditBanner(banner)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">No offer banners available. Click "Add New Offer Banner" to create one.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingBanner ? "Edit Offer Banner" : "Add New Offer Banner"}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                </label>
                <div
                  onClick={handleImageClick}
                  className={`relative w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 ${
                    errors.image ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100">
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
                {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.subtitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.subtitle && <p className="mt-1 text-sm text-red-500">{errors.subtitle}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows="3"
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="mb-4 flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Value</label>
                  <input
                    type="number"
                    name="offerValue"
                    value={formData.offerValue}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${
                      errors.offerValue ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.offerValue && <p className="mt-1 text-sm text-red-500">{errors.offerValue}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Type</label>
                  <select
                    name="offerType"
                    value={formData.offerType}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${
                      errors.offerType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="" disabled>Select Type</option>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </select>
                  {errors.offerType && <p className="mt-1 text-sm text-red-500">{errors.offerType}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.link ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.link && <p className="mt-1 text-sm text-red-500">{errors.link}</p>}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingBanner ? "Updating..." : "Adding..."}
                    </>
                  ) : editingBanner ? (
                    "Update"
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete the offer banner "${bannerToDelete?.title}"?`}
        isLoading={isDeleting}
        confirmButtonText="Delete"
        confirmButtonColor="red"
      />
    </>
  );
}

export default OfferBanner;
