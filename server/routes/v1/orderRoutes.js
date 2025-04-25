const {
  placeOrder,
  updateOrderStatus,
  filterOrders,
  getOrderById,
  getUserOrders,
  cancelOrder,
  orderStats,
} = require("../../controllers/orderController");
const autheticateToken = require("../../middlewares/authMiddleware");

const orderRouter = require("express").Router();
orderRouter.get("/get-user-orders", autheticateToken(["user"]), getUserOrders);
orderRouter.post("/placeorder", placeOrder);
orderRouter.patch(
  "/change-status/:orderId",
  autheticateToken(["admin", "store", "user"]),
  updateOrderStatus
);
orderRouter.get(
  "/get-orders",
  autheticateToken(["admin", "store"]),
  filterOrders
);

orderRouter.get(
  "/get-order-stats",
  autheticateToken(["admin", "store"]),
  orderStats
);
orderRouter.get(
  "/get-order/:orderId",
  autheticateToken(["admin", "store"]),
  getOrderById
);
orderRouter.post(
  "/cancel-order/:orderId",
  autheticateToken(["user"]),
  cancelOrder
);

module.exports = orderRouter;
