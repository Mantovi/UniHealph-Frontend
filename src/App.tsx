import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UniversityRequest from "./pages/UniversityRequest";
import AdminRequests from "./pages/AdminUniversityRequests";
import Products from "./pages/Products";
import UniversityStudents from "./pages/UniversityStudents";
import PrivateRoute from "./components/PrivateRoute";
import UniversityDashboard from "./pages/UniversityDashboard";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/request" element={<UniversityRequest />} />
        <Route path="/profile" element={<Profile />} />

        <Route element={<PrivateRoute requiredRole="ADMIN" />}>
          <Route path="/admin/see-requests" element={<AdminRequests />} />
        </Route>

        <Route element={<PrivateRoute requiredRole="UNIVERSITY" />}>
          <Route path="/university/students" element={<UniversityStudents />} />
          <Route path="/university/dashboard" element={<UniversityDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;