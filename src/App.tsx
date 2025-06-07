import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UniversityRequest from "./pages/UniversityRequest";
import AdminRequests from "./pages/AdminUniversityRequests";
import Products from "./pages/Products";
import UniversityStudents from "./pages/UniversityStudents";
import PrivateRoute from "./components/PrivateRoute";
import UniversityDashboard from "./pages/UniversityDashboard";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import Plans from "./pages/Plans";
import PaymentMethods from "./pages/PaymentMethods";

function AppWrapper() {
  const location = useLocation();

  const hideHeaderRoutes = ["/login", "/register", "/request", "/"];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/request" element={<UniversityRequest />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/products" element={<Products />} />

        <Route element={<PrivateRoute requiredRole="ADMIN" />}>
          <Route path="/admin/see-requests" element={<AdminRequests />} />
          <Route path="/admin/plans" element={<Plans />} />
          <Route path="/admin/payments" element={<PaymentMethods />} />

        </Route>

        <Route element={<PrivateRoute requiredRole="UNIVERSITY" />}>
          <Route path="/university/students" element={<UniversityStudents />} />
          <Route path="/university/dashboard" element={<UniversityDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
