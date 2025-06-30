import { useAuthInit } from "./hooks/useAuth"
import AppRoutes from "./routes/AppRoutes"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  useAuthInit()

  return (
  <>
    <AppRoutes />
    <ToastContainer
      position="top-center"
      autoClose={1000}
      hideProgressBar
      closeOnClick
      pauseOnHover={false}
      draggable={false}
      newestOnTop={true}
      limit={1}
      theme="light"
      toastClassName="text-sm min-h-10"
    />
  </>
  )
}

export default App;