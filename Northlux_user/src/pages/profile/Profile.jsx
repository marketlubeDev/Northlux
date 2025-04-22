import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SavedAddress from "./SavedAddress";
import OrderHistory from "./OrderHistory";
import HelpandSupport from "./HelpandSupport";
import { useDispatch, useSelector } from "react-redux";
import userService from "../../api/services/userService";
import { toast } from "sonner";
import { setUser } from "../../redux/features/user/userSlice";
const Profile = () => {
  const user = useSelector((state) => state.user.user);
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("personal-info");
  const [formData, setFormData] = useState({
    name: user?.username,
    phone: user?.phonenumber,
  });
  const [phoneError, setPhoneError] = useState("");
  const dispatch = useDispatch();

  // Update active tab when URL parameter changes
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    updatedUser();
  }, []);

  const updatedUser = async () => {
    const response = await userService.getAuthUser();
    dispatch(setUser(response.user));
    console.log(response.user);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }

    if (
      formData.name.trim() === user?.username &&
      formData.phone.trim() === user?.phonenumber
    ) {
      toast.error("No changes made");
      return;
    }

    try {
      const user = await userService.updateUser({
        username: formData.name,
        phonenumber: formData.phone,
      });
      console.log(user);
      toast.success("Profile updated successfully");
      dispatch(setUser(user));
    } catch (error) {
      console.log(error);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Only allow digits
    const phoneNumber = value.replace(/\D/g, '');
    setFormData({ ...formData, phone: phoneNumber });
    // Clear error when user starts typing valid numbers
    if (/^\d{10}$/.test(phoneNumber)) {
      setPhoneError("");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal-info":
        return (
          <>
            <h2>
              Welcome, <span className="username">{user?.username}</span>
            </h2>

            {/* <div className="profile-picture-section">
              <div className="profile-picture">
                <img src="/images/user/profilepicture.jpg" alt="Profile" />
              </div>
              <button className="upload-btn">Upload new picture</button>
            </div> */}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Phone number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  maxLength={10}
                />
                {phoneError && <span className="error-message">{phoneError}</span>}
              </div>

              {/* <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div> */}

              <div className="form-footer">
                <button type="button" className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Profile
                </button>
              </div>
            </form>
          </>
        );
      case "saved-address":
        return <SavedAddress />;
      case "order-history":
        return <OrderHistory />;
      case "help-support":
        return <HelpandSupport />;
      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <span>My account</span>
      </div>

      <div className="profile-container">
        <div className="sidebar">
          <nav>
            <ul>
              <li
                className={activeTab === "personal-info" ? "active" : ""}
                onClick={() => setActiveTab("personal-info")}
              >
                Personal Info
              </li>
              <li
                className={activeTab === "saved-address" ? "active" : ""}
                onClick={() => setActiveTab("saved-address")}
              >
                Saved Address
              </li>
              <li
                className={activeTab === "order-history" ? "active" : ""}
                onClick={() => setActiveTab("order-history")}
              >
                Order History
              </li>
              <li
                className={activeTab === "help-support" ? "active" : ""}
                onClick={() => setActiveTab("help-support")}
              >
                Help & Support
              </li>
            </ul>
          </nav>
        </div>

        <div className="profile-content">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Profile;
