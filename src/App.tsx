import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import GridLoader from "./components/loader/GridLoader"
import Navbar from "./components/navbar/Navbar"
import AppToast from "./components/toast/AppToast"

function App() {
  return (
    <>
      <Navbar />

      <main className="container mt-4">
        <Suspense fallback={<GridLoader />}>
          <Outlet />
        </Suspense>
      </main>

      <AppToast />
    </>
  )
}

export default App
