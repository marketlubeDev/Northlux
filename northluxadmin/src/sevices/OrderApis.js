import { axiosInstance } from "../axios/axiosInstance";

export const getOrders = async (queryParams = "") => {
console.log(queryParams , "query");
  return axiosInstance
    .get(`/order/get-orders${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
};

export const getOrderStats = () => {
  return axiosInstance
    .get("/order/get-order-stats")
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
};

export const updateOrderStatus = async (orderId, status, type) => {
  return axiosInstance
    .patch(`/order/change-status/${orderId}`, { status, type })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
};
// Modify the getOrders function to accept query parameters
// export const getOrders = async (queryParams = "") => {
//   try {
//     const response = await axiosInstance.get(
//       `/api/v1/admin/orders${queryParams}`
//     );
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
