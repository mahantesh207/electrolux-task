import { lazy } from "react"
import { createBrowserRouter } from "react-router-dom"
import App from "../App"

const ProductListPage = lazy(() => import("../pages/ProductListPage"))
const ProductDetailPage = lazy(() => import("../pages/ProductDetailPage"))
const CartPage = lazy(() => import("../pages/CartPage"))

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <ProductListPage />
      },
      {
        path: "products/:productId",
        element: <ProductDetailPage />
      },
      {
        path: "cart",
        element: <CartPage />
      }
    ]
  }
])
