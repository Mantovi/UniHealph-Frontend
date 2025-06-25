import { useAuthInit } from "./hooks/useAuth"
import AppRoutes from "./routes/AppRoutes"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  useAuthInit()

  return (
    <>
      <AppRoutes/>
      <ToastContainer
      position="top-center"
      autoClose={1500}
      hideProgressBar
      closeOnClick
      pauseOnHover={false}
      draggable={false}
      newestOnTop={true}
      limit={1}
      theme="light"
      style={{ fontSize: '0.875rem', minHeight: '40px' }}/>
    </>
  )
}

export default App;