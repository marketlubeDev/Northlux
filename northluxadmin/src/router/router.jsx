import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import LoginComponent from "../components/shared/LoginComponent";
import DashBoard from "../pages/admin/DashBoard";
import Products from "../pages/admin/Products";
import Orders from "../pages/admin/Orders";
import Coupons from "../pages/admin/Coupons";
import Review from "../pages/admin/Review";
import Customers from "../pages/admin/Customers";
import Addproduct from "../pages/admin/Addproduct";
import ProtectedRoute from "./AdminProtectedRoute/ProtectedRoute";
import Category from "../pages/admin/Category";
import Brand from "../pages/admin/Brand";
import Label from "../pages/admin/Label";
import Banner from "../pages/admin/Banner";
import OfferBanner from "../pages/admin/OfferBanner";
import Store from "../pages/admin/Store";
import Storeinfo from "../pages/admin/Storeinfo";
import StoreLayout from "../layouts/StoreLayout/StoreLayout";
import Landingpage from "../pages/Landing/Landingpage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landingpage />,
  },
  {
    path: "/admin/login",
    element: <LoginComponent role={"admin"} />,
  },
  {
    path: "/store/login",
    element: <LoginComponent role={"store"} />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <DashBoard />,
      },
      {
        path: "product",
        element: <Products />,
      },
      {
        path: "product/addproduct",
        element: <Addproduct />,
      },
      {
        path: "order",
        element: <Orders />,
      },
      {
        path: "category",
        element: <Category />,
      },
      {
        path: "brand",
        element: <Brand />,
      },
      {
        path: "label",
        element: <Label />,
      },
      {
        path: "coupon",
        element: <Coupons />,
      },

      {
        path: "review",
        element: <Review />,
      },
      {
        path: "customer",
        element: <Customers />,
      },
      {
        path: "banner",
        element: <Banner />,
      },
      {
        path: "offer-banner",
        element: <OfferBanner />,
      },
      {
        path: "store",
        element: <Store />,
      },
      {
        path: "storeinfo/:id",
        element: <Storeinfo />,
      },
    ],
  },

  {
    path: "/store",
    element: <StoreLayout />,
    children: [
      {
        path: "",
        element: <DashBoard role={"store"} />,
      },
      {
        path: "product",
        element: <Products role={"store"} />,
      },
      {
        path: "product/addproduct",
        element: <Addproduct role={"store"} />,
      },
      {
        path: "order",
        element: <Orders role={"store"} />,
      },
      {
        path: "category",
        element: <Category role={"store"} />,
      },
      {
        path: "brand",
        element: <Brand role={"store"} />,
      },
      {
        path: "label",
        element: <Label role={"store"} />,
      },
      {
        path: "coupon",
        element: <Coupons role={"store"} />,
      },

      {
        path: "review",
        element: <Review role={"store"} />,
      },
      {
        path: "customer",
        element: <Customers role={"store"} />,
      },
      {
        path: "banner",
        element: <Banner role={"store"} />,
      },
      {
        path: "offer-banner",
        element: <OfferBanner role={"store"} />,
      },
      {
        path: "store",
        element: <Store role={"store"} />,
      },
      {
        path: "storeinfo/:id",
        element: <Storeinfo role={"store"} />,
      },
    ],
  },
]);
