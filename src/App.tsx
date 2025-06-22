import { useAuthInit } from "./hooks/useAuth"
import AppRoutes from "./routes/AppRoutes"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  useAuthInit()

  return (
    <>
      <AppRoutes/>
      <ToastContainer/>
    </>
  )
}

export default App;