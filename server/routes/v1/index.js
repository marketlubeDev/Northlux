const adminRouter = require("./adminRoutes");
const bannerRouter = require("./bannerRoutes");
const brandRouter = require("./brandRoutes");
const categoryRouter = require("./categoryRoutes");
const labelRouter = require("./labelRoutes");
const orderRouter = require("./orderRoutes");
const productRouter = require("./productRoutes");
const userRouter = require("./userRoutes");
const v1Router = require("express").Router();
const offerBannerRouter = require("./offerBannerRoute");
const storeRouter = require("./storeRoutes");

v1Router.use("/user", userRouter);
v1Router.use("/product", productRouter);
v1Router.use("/admin", adminRouter);
v1Router.use("/category", categoryRouter);
v1Router.use("/label", labelRouter);
v1Router.use("/order", orderRouter);
v1Router.use("/brand", brandRouter);
v1Router.use("/banner", bannerRouter);
v1Router.use("/offerBanner", offerBannerRouter);
v1Router.use("/store", storeRouter);

module.exports = v1Router;
