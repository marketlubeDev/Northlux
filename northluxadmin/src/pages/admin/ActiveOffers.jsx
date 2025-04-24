import React, { useState, useEffect } from "react";
import PageHeader from "../../components/Admin/PageHeader";
import { useFetch } from "../../hooks/useFetch";

export const ActiveOffers = () => {
  // const [activeOffers, setActiveOffers] = useState([]);


const[activeOffersData] = useFetch("/offers");

console.log(activeOffersData, "================activeOffersData");


  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <PageHeader content="Active Offers" />
    </div>
  );
};
