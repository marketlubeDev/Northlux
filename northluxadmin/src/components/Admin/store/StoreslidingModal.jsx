import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { addStore, getStores, updateStore } from "../../../sevices/storeApis";
import { toast } from "react-toastify";
import { setStores } from "../../../redux/features/AdminUtilities";
import { useDispatch } from "react-redux";

const StoreSlidingModal = ({ isOpen, onClose, editData = null, stores }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [values, setValues] = useState({
    storeName: "",
    storeNumber: "",
    email: "",
    login_phoneNumber: "",
    password: "",
    confirmPassword: "",
    locality: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const refetch = () => {
    getStores().then((res) => {
      dispatch(setStores(res?.stores));
    });
  };

  useEffect(() => {
    if (editData) {
      setValues({
        storeName: editData.store_name || "",
        storeNumber: editData.store_number || "",
        email: editData.email || "",
        login_phoneNumber: editData.login_number || "",
        password: editData.password || "",
        confirmPassword: editData.password || "",
        locality: editData?.address?.area || "",
        city: editData?.address?.city || "",
        district: editData?.address?.district || "",
        state: editData?.address?.state || "",
        pincode: editData?.address?.pincode || "",
      });
    } else {
      // Reset form when opening in create mode
      setValues({
        storeName: "",
        storeNumber: "",
        email: "",
        login_phoneNumber: "",
        password: "",
        confirmPassword: "",
        locality: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
      });
    }
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [editData, isOpen]);

  const handleSubmit = async () => {
    if (
      values.storeName === "" ||
      values.storeNumber === "" ||
      values.email === "" ||
      values.login_phoneNumber === "" ||
      values.password === "" ||
      values.confirmPassword === "" ||
      values.locality === "" ||
      values.city === "" ||
      values.district === "" ||
      values.state === "" ||
      values.pincode === ""
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    if (values.password !== values.confirmPassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    }
    try {
      const formData = {
        store_name: values.storeName,
        store_number: values.storeNumber,
        email: values.email,
        login_number: values.login_phoneNumber,
        password: values.password,
        address: {
          area: values.locality,
          city: values.city,
          district: values.district,
          state: values.state,
          pincode: values.pincode,
        },
      };

      if (editData) {
        const response = await updateStore(formData, editData._id);

        if (response?.success) {
          refetch();
          toast.success(response?.message || "Store updated successfully");
          onClose();
        } else {
          toast.error(response?.message || "Something went wrong");
        }
      } else {
        const response = await addStore(formData);

        if (response?.success) {
          refetch();
          toast.success(response?.message || "Store created successfully");
          onClose();
        } else {
          toast.error(response?.message || "Something went wrong");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 right-0 w-[500px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } z-50`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <h2 className="text-xl font-semibold mb-2">
            {editData ? "Edit store" : "Add store"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {editData ? "Update store details" : "Create a new store entry"}
          </p>

          <form className="space-y-6">
            <div>
              <p className="font-medium mb-4">STORE DETAILS</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Store name</label>
                  <input
                    type="text"
                    placeholder="e.g. Northlux Official Outlet"
                    className="w-full p-2 border rounded focus:outline-none focus:border-[#259960]"
                    value={values.storeName}
                    onChange={(e) =>
                      setValues({ ...values, storeName: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Store Number</label>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="9999 555 666"
                        className="w-full p-2 border rounded-r focus:outline-none focus:border-[#259960]"
                        value={values.storeNumber}
                        onChange={(e) =>
                          setValues({ ...values, storeNumber: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Email address</label>
                    <input
                      type="email"
                      placeholder="e.g. storename@gmail.com"
                      className="w-full p-2 border rounded focus:outline-none focus:border-[#259960]"
                      value={values.email}
                      onChange={(e) =>
                        setValues({ ...values, email: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="font-medium mb-4">LOGIN CREDENTIALS</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Phone number</label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="9999 555 666"
                      className="w-full p-2 border rounded-r focus:outline-none focus:border-[#259960]"
                      value={values.login_phoneNumber}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          login_phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full p-2 border rounded focus:outline-none focus:border-[#259960]"
                        value={values.password}
                        onChange={(e) =>
                          setValues({ ...values, password: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2.5 text-gray-400"
                      >
                        {showPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full p-2 border rounded focus:outline-none focus:border-[#259960]"
                        value={values.confirmPassword}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-2 top-2.5 text-gray-400"
                      >
                        {showConfirmPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="font-medium mb-4">ADDRESS</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Locality/area</label>
                    <input
                      type="text"
                      placeholder="e.g. Vylle"
                      className="w-full p-2 border rounded focus:outline-none focus:border-[#259960]"
                      value={values.locality}
                      onChange={(e) =>
                        setValues({ ...values, locality: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Kochi"
                      className="w-full p-2 border rounded focus:outline-none focus:border-[#259960]"
                      value={values.city}
                      onChange={(e) =>
                        setValues({ ...values, city: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">District</label>
                    <input
                      type="text"
                      placeholder="e.g. Ernakulam"
                      className="w-full p-2 border rounded focus:outline-none focus:border-[#259960]"
                      value={values.district}
                      onChange={(e) =>
                        setValues({ ...values, district: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">State</label>
                    <input
                      type="text"
                      placeholder="e.g. Kerala"
                      className="w-full p-2 border rounded focus:outline-none focus:border-[#259960]"
                      value={values.state}
                      onChange={(e) =>
                        setValues({ ...values, state: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">Pincode</label>
                  <input
                    type="text"
                    placeholder="e.g. 682 019"
                    className="w-full p-2 border rounded focus:outline-none focus:border-[#259960]"
                    value={values.pincode}
                    onChange={(e) =>
                      setValues({ ...values, pincode: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </form>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 bg-[#259960] text-white rounded hover:bg-[#1e7a4c]"
              onClick={handleSubmit}
            >
              {editData ? "Update store" : "Create store"}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default StoreSlidingModal;
