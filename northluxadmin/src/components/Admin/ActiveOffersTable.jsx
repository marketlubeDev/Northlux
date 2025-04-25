// ActiveOffersTable.jsx
import React, { useState } from "react";
// import { FaTrash } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios/axiosInstance";

export const ActiveOffersTable = ({ offers }) => {
  const [selectedOffers, setSelectedOffers] = useState([]);

  console.log(selectedOffers, "=========selectedOffers");
  console.log(offers, "=========offers");

  const handleSelectAll = (e) => {
    setSelectedOffers(e.target.checked ? offers.map((offer) => offer._id) : []);
  };

  const handleSelectOffer = (offerId) => {
    setSelectedOffers((prev) => [...prev, offerId]);
  };

  const handleDeleteOffer = async (id) => {
    console.log(selectedOffers, "=========selectedOffers");
    try {
      const response = await axiosInstance.delete(`/offer/${id}`);
      console.log(response, "=========response");
      toast.success("Offers deleted successfully");
    } catch (error) {
      toast.error("Error deleting offers");
    }
  };

  return (
    <div className="overflow-x-auto py-12 px-5">
      <table className="min-w-full bg-white rounded-xl drop-shadow-lg shadow-xl">
        <thead className="bg-green-100 text-gray-600 *:text-sm *:font-normal">
          <tr>
            <th className="py-2 px-4" onClick={handleSelectAll}>
              <input type="checkbox" onChange={handleSelectAll} />
            </th>
            <th className="py-2 px-4">Offer Name</th>
            <th className="py-2 px-4">Banner</th>
            <th className="py-2 px-4">Type</th>
            <th className="py-2 px-4">Products Included</th>
            <th className="py-2 px-4">Offer Value</th>
            <th className="py-2 px-4">Start Date</th>
            <th className="py-2 px-4">End Date</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 *:text-sm">
          {offers.map((offer, index) => (
            <tr key={index} className="text-center border-b">
              <td className="py-2 px-4">
                <input
                  type="checkbox"
                  checked={selectedOffers.includes(offer._id)}
                  onChange={() => handleSelectOffer(offer._id)}
                />
              </td>
              <td className="py-2 px-4 font-medium text-gray-800">
                {offer.offerName}
              </td>
              <td className="py-2 px-4">
                <img
                  src={offer.bannerImage}
                  alt={offer.offerName}
                  className="h-10 mx-auto"
                />
              </td>
              <td className="py-2 px-4">{offer.offerType}</td>
              <td className="py-2 px-4">
                {offer.products.map((product) => product.name).join(", ")}
              </td>
              <td className="py-2 px-4 text-green-500 font-medium">
                {offer.offerValue}{" "}
                {offer.offerMetric === "percentage" ? "%" : "₹"}
              </td>
              <td className="py-2 px-4">{offer.startDate}</td>
              <td className="py-2 px-4">{offer.endDate}</td>
              <td className="py-2 px-4">
                <button
                  className="text-red-500 font-extrabold"
                  onClick={() => handleDeleteOffer(offer._id)}
                >
                  <GoTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
