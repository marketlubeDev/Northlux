import PageHeader from "../../components/Admin/PageHeader";
import DateRangePicker from "../../components/shared/Datepicker";
import Ordercards from "../../components/Admin/Order/Ordercards";
import { getcategoriesbrands } from "../../sevices/adminApis";
import {
  getOrders,
  getOrderStats,
  updateOrderStatus,
} from "../../sevices/OrderApis";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";
import { useEffect, useState, useRef } from "react";
import { TfiReload } from "react-icons/tfi";
import { toast } from "react-toastify";

function Orders() {
  const [formUtilites, setFormUtilites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const orderStatuses = [
    "pending",
    "processed",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
    "onrefound",
  ];

  console.log(dateRange , "date");
  console.log(dateRange , "date");



  // Move fetchData outside of useEffect so it can be reused
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [startDate, endDate] = dateRange;

      let queryParams = [];

      if (startDate && endDate) {
        // Format dates to start and end of day in UTC
        const formattedStartDate = new Date(startDate.setHours(0, 0, 0, 0)).toISOString();
        const formattedEndDate = new Date(endDate.setHours(23, 59, 59, 999)).toISOString();

        queryParams.push(`startDate=${formattedStartDate}`);
        queryParams.push(`endDate=${formattedEndDate}`);
      }

      if (selectedCategory) {
        queryParams.push(`category=${selectedCategory}`);
      }

      if (selectedStatus) {
        queryParams.push(`status=${selectedStatus.toLowerCase()}`);
      }

      const queryString =
        queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

      const [ordersRes, statsRes] = await Promise.all([
        getOrders(queryString),
        getOrderStats(),
      ]);
      setOrders(ordersRes.orders);
      setOrderStats(statsRes.stats);
      setErrorMessage("");
    } catch (err) {
      setOrders([]);
      setErrorMessage(err.response?.data?.message || "No orders found");
    } finally {
      setIsLoading(false);
    }
  };

  // Update useEffect to use the new fetchData function
  useEffect(() => {
    fetchData();
  }, [dateRange, selectedCategory, selectedStatus]);

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

  const ConfirmationPopup = ({ isOpen, onClose, onConfirm, status }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Confirm Status Change</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to change the status to "{status}"?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  const StatusDropdown = ({ currentStatus, options, onStatusChange, type }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const dropdownRef = useRef(null);

    // Check if status changes should be disabled
    const isStatusChangeDisabled = currentStatus === "delivered";

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    const handleStatusClick = (status) => {
      if (isStatusChangeDisabled) return;
      setSelectedStatus(status);
      setShowConfirmation(true);
      setIsOpen(false);
    };

    const handleConfirm = () => {
      onStatusChange(selectedStatus);
      setShowConfirmation(false);
      setSelectedStatus(null);
    };

    const getStatusColor = (status) => {
      const colors = {
        pending: "bg-yellow-100 text-yellow-800",
        paid: "bg-green-100 text-green-800",
        failed: "bg-red-100 text-red-800",
        processed: "bg-blue-100 text-blue-800",
        shipped: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        onrefound: "bg-amber-100 text-amber-800",
        refunded: "bg-gray-100 text-gray-800",
        cancelled: "bg-red-100 text-red-800",
      };
      return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
    };

    const formatStatusDisplay = (status) => {
      const displayFormats = {
        pending: "Pending",
        processed: "Processed",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled",
        refunded: "Refunded",
        onrefound: "On Refund",
        paid: "Paid",
        failed: "Failed",
        onrefund: "On Refund",
      };
      return displayFormats[status] || status;
    };

    return (
      <td className="px-6 py-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => !isStatusChangeDisabled && setIsOpen(!isOpen)}
            className={`inline-flex items-center gap-2 ${
              isStatusChangeDisabled ? "cursor-not-allowed opacity-75" : ""
            }`}
            disabled={isStatusChangeDisabled}
            title={
              isStatusChangeDisabled
                ? "Status cannot be changed after delivery"
                : ""
            }
          >
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                currentStatus
              )}`}
            >
              {formatStatusDisplay(currentStatus)}
            </span>
            {!isStatusChangeDisabled && (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>

          {isOpen && !isStatusChangeDisabled && (
            <div
              className="absolute rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
              style={{
                zIndex: 50,
                marginTop: "0.5rem",
                minWidth: "150px",
              }}
            >
              <div className="py-1" role="menu">
                {options?.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusClick(status)}
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                      currentStatus === status ? "bg-gray-50" : ""
                    }`}
                  >
                    {formatStatusDisplay(status)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <ConfirmationPopup
            isOpen={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            onConfirm={handleConfirm}
            status={`${
              type === "payment" ? "Payment" : "Order"
            } status to ${formatStatusDisplay(selectedStatus)}`}
          />
        </div>
      </td>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const TableRow = ({ order }) => {
    console.log(order , "order");
    const [paymentStatus, setPaymentStatus] = useState(
      order.paymentStatus || "pending"
    );
    const [orderStatus, setOrderStatus] = useState(order.status || "pending");

    const paymentOptions = [
      "pending",
      "paid",
      "failed",
      "refunded",
      "onrefund",
    ];
    const orderOptions = [
      "pending",
      "processed",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
      "onrefund",
    ];

    const handlePaymentStatusChange = async (newStatus) => {
      try {
        const result = await updateOrderStatus(order._id, newStatus, "payment");
        if (result.success) {
          setPaymentStatus(newStatus);
          toast.success(result.message);
          // Refresh data after successful status update
          await fetchData();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to update payment status");
      }
    };

    const handleOrderStatusChange = async (newStatus) => {
      try {
        const result = await updateOrderStatus(order._id, newStatus, "order");
        if (result.success) {
          setOrderStatus(newStatus);
          toast.success(result.message);
          // Refresh data after successful status update
          await fetchData();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to update order status");
      }
    };

    // Function to format products display
    const formatProducts = (products) => {
      return products?.map((product, index) => (
        <div
          key={product._id}
          className={index !== 0 ? "mt-2 pt-2 border-t" : ""}
        >
          <div className="flex items-start">
            <img
              src={
                product?.productId?.images[0]
                  ? product?.productId?.images[0]
                  : product?.variantId?.images[0]
              }
              alt={product.productId.name}
              className="w-10 h-10 object-cover rounded mr-2"
            />
            <div>
              <p className="font-medium">{product.productId.name}</p>
              <p className="text-xs text-gray-500">
                Qty: {product.quantity} × ₹{product.price}
              </p>
            </div>
          </div>
        </div>
      ));
    };

    const getAvailableOrderOptions = () => {
      if (orderStatus === "delivered") {
        return ["delivered"]; // Only show current status if delivered
      }
      return orderOptions;
    };

    return (
      <tr className="bg-white border-b hover:bg-gray-50">
        <td className="px-6 py-4">
          <div className="max-h-32 overflow-y-auto">
            {formatProducts(order.products)}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {formatDate(order.createdAt)}
        </td>
        <td className="px-6 py-4">{order?.user?.phonenumber}</td>
        <td className="px-6 py-4">{order?.deliveryAddress?.pincode || "N/A"}</td>
        <td className="px-6 py-4">
          <div className="space-y-1">
            {[
              ...new Set(order.products?.map((p) => p.productId.category.name)),
            ].join(", ")}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="font-medium text-gray-900">
            ₹{order.totalAmount?.toLocaleString() || 0}
          </div>
        </td>
        <StatusDropdown
          currentStatus={paymentStatus}
          options={paymentOptions}
          onStatusChange={handlePaymentStatusChange}
          type="payment"
        />
        <StatusDropdown
          currentStatus={orderStatus}
          options={getAvailableOrderOptions()}
          onStatusChange={handleOrderStatusChange}
          type="order"
        />
      </tr>
    );
  };

  return (
    <div>
      <PageHeader content={"Orders"} />

      {isLoading ? (
        <LoadingSpinner color="primary" text="Loading orders..." fullScreen />
      ) : (
        <>
          <div className="flex gap-[3rem]">
            <div className="w-1/3 space-y-2">
              <p className="font-medium text-sm">Sales Period</p>
              <div className="w-full">
                <DateRangePicker
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Filter by Product Category</option>
                  {formUtilites.categories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Filter by Status</option>
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 items-center flex-wrap">
              {orderStats && (
                <>
                  <Ordercards
                    data="Pending Orders"
                    count={orderStats.statusCounts?.pending || 0}
                    color="#FFA500"
                  />
                  <Ordercards
                    data="Processing Orders"
                    count={orderStats.statusCounts?.processed || 0}
                    color="#3B82F6"
                  />
                  <Ordercards
                    data="Shipped Orders"
                    count={orderStats.statusCounts?.shipped || 0}
                    color="#8B5CF6"
                  />
                  <Ordercards
                    data="Delivered Orders"
                    count={orderStats.statusCounts?.delivered || 0}
                    color="#10B981"
                  />
                  <Ordercards
                    data="On Refund Orders"
                    count={orderStats.statusCounts?.onrefund || 0}
                    color="#F59E0B"
                  />
                  <Ordercards
                    data="Refunded Orders"
                    count={orderStats.statusCounts?.refunded || 0}
                    color="#6B7280"
                  />
                  <Ordercards
                    data="Cancelled Orders"
                    count={orderStats.statusCounts?.cancelled || 0}
                    color="#EF4444"
                  />
                </>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-4 mb-2 mr-4">
            {(selectedCategory ||
              selectedStatus ||
              (dateRange[0] && dateRange[1])) && (
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedStatus("");
                  setDateRange([null, null]);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <TfiReload className="w-4 h-4" />
                <span>Reset Filters</span>
                <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                  {[
                    selectedCategory && "Category",
                    selectedStatus && "Status",
                    dateRange[0] && dateRange[1] && "Date",
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </button>
            )}
          </div>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Order Items
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">Date Placed</div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">Phone Number</div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">Address</div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">Categories</div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">Total Amount</div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">Payment Status</div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">Order Status</div>
                  </th>
                </tr>
              </thead>
              {orders && orders.length > 0 ? (
                <tbody>
                  {orders.map((order) => (
                    <TableRow key={order._id} order={order} />
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-12 text-center text-gray-500 bg-gray-50"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-12 h-12 mb-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <p className="text-lg font-medium">No orders found</p>
                        {dateRange[0] && dateRange[1] && (
                          <p className="mt-1 text-sm text-gray-400">
                            Try selecting a different date range
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Orders;
