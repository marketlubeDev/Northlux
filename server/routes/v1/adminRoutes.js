const {
  adminRegister,
  AdminLogin,
  adminLogout,
  getSalesDetails,
  monthlyReport,
  AdminDashboard,
  fetchCategoriesAndBrands,
  checkAdmin,
} = require("../../controllers/adminController");
const autheticateToken = require("../../middlewares/authMiddleware");
const {
  getAllStores,
  createStore,
  editStore,
  getStoreAndProducts,
} = require("../../controllers/storeController");
const adminRouter = require("express").Router();

adminRouter.get("/getstores", autheticateToken(["admin"]), getAllStores);
adminRouter.get(
  "/getstoreandproducts/:id",
  autheticateToken(["admin"]),
  getStoreAndProducts
);
adminRouter.get("/salesreport", autheticateToken(["admin"]), getSalesDetails);
adminRouter.get("/monthlyreport", autheticateToken(["admin"]), monthlyReport);
adminRouter.get(
  "/dashboard",
  autheticateToken(["admin", "store"]),
  AdminDashboard
);
adminRouter.get(
  "/getcategoriesbrands",
  autheticateToken(["admin"]),
  fetchCategoriesAndBrands
);
adminRouter.post("/register", adminRegister);
adminRouter.post("/login", AdminLogin);
adminRouter.post("/logout", adminLogout);
adminRouter.post("/create-store", autheticateToken(["admin"]), createStore);
adminRouter.patch("/edit-store/:id", autheticateToken(["admin"]), editStore);
adminRouter.get("/checkadmin", autheticateToken(["admin"]), checkAdmin);

//sales

module.exports = adminRouter;
