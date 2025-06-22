import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "@/pages/Register";
import PermittedStudents from "@/pages/PermittedStudents";
import UniversityRequest from "@/pages/UniversityRequest";
import AdminUniversityRequest from "@/pages/AdminUniversityRequest";
import Unauthorized from "@/pages/Unauthorized";
import UserProfile from "@/pages/UserProfile";
import Products from "@/pages/Products";
import PrivateLayout from "@/layouts/PrivateLayout";
import PublicLayout from "@/layouts/PublicLayout";
import Cart from "@/pages/Cart";
import Categories from "@/pages/Categories";
import Product from "@/pages/Product";
import Orders from "@/pages/Orders";
import Rentals from "@/pages/Rentals";
const AppRoutes = () => {
    return (
    <Routes>
      <Route element={<PublicLayout/>}>
        <Route path="/" element={<Home/>}/>
        <Route path="/unauthorized" element={<Unauthorized/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/university-request" element={<UniversityRequest/>}/>
      </Route>

      <Route element={<PrivateLayout/>}>
        <Route path="/permitted-students" element={<PermittedStudents/>}/>
        <Route path="/see-requests" element={<AdminUniversityRequest/>}/>
        <Route path="/profile" element={<UserProfile/>}/>
        <Route path="/categories" element={<Categories/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/product/:id" element={<Product/>}/>
        <Route path="/orders" element={<Orders/>}/>
        <Route path="/rentals" element={<Rentals/>}/>
      </Route>
    </Routes>
    );
}

export default AppRoutes;