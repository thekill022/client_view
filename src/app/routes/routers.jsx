import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/home";
import Products from "../pages/products";
import Preview from "../pages/preview";
import Rules from "../pages/rule";
import Payment from "../pages/payment";
import PaymentSuccess from "../pages/paymentSuccess";
import PaymentFailed from "../pages/paymentFailed";
import PaymentCallback from "../pages/paymentCallback";

import JokiPage from "../pages/joki";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/joki",
    element: <JokiPage />,
  },
  {
    path: "/product",
    element: <Products />,
  },
  {
    path: "/rules",
    element: <Rules />,
  },
  {
    path: "/preview/:id",
    element: <Preview />,
  },
  {
    path: "/payment",
    element: <Payment />,
  },
  {
    path: "/payment/callback",
    element: <PaymentCallback />,
  },
  {
    path: "/payment/success",
    element: <PaymentSuccess />,
  },
  {
    path: "/payment/failed",
    element: <PaymentFailed />,
  },
]);

export default function ManageState() {
  return <RouterProvider router={router} />;
}
