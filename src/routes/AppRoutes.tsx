import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "@/pages/Register";
import PublicLayout from "@/layouts/PublicLayout";
import PrivateLayout from "@/layouts/PrivateLayout";
import AdminUniversityRequest from "@/pages/AdminUniversityRequest";
import UniversityRequest from "@/pages/UniversityRequest";
import Unauthorized from "@/pages/Unauthorized";

const AppRoutes = () => {
    return (
    <Routes>
        <Route element={<PublicLayout/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/unauthorized" element={<Unauthorized/>}/>
            <Route path="/university-request" element={<UniversityRequest/>}/>
        </Route>

        <Route element={<PrivateLayout/>}>
            <Route path="/products" element={<h1>Produtos</h1>}/>
            <Route path="/see-requests" element={<AdminUniversityRequest/>}/>

        </Route>
    </Routes>
    );
}

export default AppRoutes;