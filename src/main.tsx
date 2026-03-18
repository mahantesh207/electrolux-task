import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { Provider } from "react-redux"

import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"

import QueryProvider, { createAppQueryClient } from "./providers/QueryProvider"
import { store } from "./store/store"
import { router } from "./router/router"

const queryClient = createAppQueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <QueryProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryProvider>
  </Provider>
)
