const adminRouter = require("./adminRoutes");
const bannerRouter = require("./bannerRoutes");
const brandRouter = require("./brandRoutes");
const cartRouter = require("./cartRoutes");
const categoryRouter = require("./categoryRoutes");
const couponRouter = require("./couponRoutes");
const labelRouter = require("./labelRoutes");
const orderRouter = require("./orderRoutes");
const productRouter = require("./productRoutes");
const reviewRouter = require("./reviewRoutes");
const sellerRouter = require("./sellerRoutes");
const userRouter = require("./userRoutes");
const v1Router = require("express").Router();
const offerBannerRouter = require("./offerBannerRoute");
const utilitesRouter = require("./utilitesRoutes");
const offerRouter = require("./offerRoutes");


v1Router.use("/user", userRouter);
v1Router.use("/product", productRouter);
v1Router.use("/admin", adminRouter);
v1Router.use("/category", categoryRouter);
v1Router.use("/seller", sellerRouter);
v1Router.use("/cart", cartRouter);
v1Router.use("/label", labelRouter);
v1Router.use("/review", reviewRouter);
v1Router.use("/order", orderRouter);
v1Router.use("/brand", brandRouter);
v1Router.use("/coupon", couponRouter);
v1Router.use("/banner", bannerRouter);
v1Router.use("/offerBanner", offerBannerRouter);
v1Router.use("/utilities", utilitesRouter);
v1Router.use("/offer", offerRouter);

module.exports = v1Router;
