import { Route, Routes, useLocation } from "react-router-dom"
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "@/pages/Register";
import PermittedStudents from "@/pages/PermittedStudents";
import UniversityRequest from "@/pages/UniversityRequest";
import AdminUniversityRequest from "@/pages/admin/AdminUniversityRequest";
import Unauthorized from "@/pages/Unauthorized";
import UserProfile from "@/pages/UserProfile";
import Products from "@/pages/Products";
import PrivateLayout from "@/layouts/PrivateLayout";
import PublicLayout from "@/layouts/PublicLayout";
import Cart from "@/pages/Cart";
import CategoriesList from "@/pages/CategoriesList";
import Categories from "@/pages/admin/Categories";
import Product from "@/pages/Product";
import Orders from "@/pages/Orders";
import Rentals from "@/pages/admin/Rentals";
import Points from "@/pages/Points";
import Admin from "@/pages/admin/Admin";
import Plans from "@/pages/admin/Plans";
import PlansCreate from "@/pages/admin/PlansCreate";
import PlansUpdate from "@/pages/admin/PlansUpdate";
import PaymentMethods from "@/pages/admin/PaymentMethods";
import PaymentMethodsUpdate from "@/pages/admin/PaymentMethodsUpdate";
import PaymentMethodsCreate from "@/pages/admin/PaymentMethosCreate";
import Brands from "@/pages/admin/Brands";
import BrandsCreate from "@/pages/admin/BrandsCreate";
import BrandsUpdate from "@/pages/admin/BrandsUpdate";
import Specialties from "@/pages/admin/Specialties";
import SpecialtiesCreate from "@/pages/admin/SpecialtiesCreate";
import SpecialtiesUpdate from "@/pages/admin/SpecialtiesUpdate";
import SubSpecialties from "@/pages/admin/SubSpecialties";
import SubSpecialtiesCreate from "@/pages/admin/SubSpecialtiesCreate";
import SubSpecialtiesUpdate from "@/pages/admin/SubSpecialtiesUpdate";
import CategoriesCreate from "@/pages/admin/CategoriesCreate";
import CategoriesUpdate from "@/pages/admin/CategoriesUpdate";
import ProductTypes from "@/pages/admin/ProductTypes";
import ProductTypesCreate from "@/pages/admin/ProductTypesCreate";
import ProductTypesUpdate from "@/pages/admin/ProductTypesUpdate";
import ProductsList from "@/pages/admin/ProductsList";
import ProductsCreate from "@/pages/admin/ProductsCreate";
import ProductsUpdate from "@/pages/admin/ProductsUpdate";
import CategoryHierarchy from "@/pages/admin/CategoryHierarchy";
import StudentRentals from "@/pages/StudentRentals";
export default function AppRoutes () {
  const location = useLocation();
  const state = location.state as {backgroundLocation?: Location};

    return (
      <>
    <Routes location={state?.backgroundLocation || location}>
      <Route element={<PublicLayout/>}>
        <Route path="/" element={<Home/>}/>
        <Route path="/unauthorized" element={<Unauthorized/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/university-request" element={<UniversityRequest/>}/>
      </Route>

      <Route element={<PrivateLayout/>}>
        <Route path="/permitted-students" element={<PermittedStudents/>}/>
        <Route path="/profile" element={<UserProfile/>}/>
        <Route path="/categories" element={<CategoriesList/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/product/:id" element={<Product/>}/>
        <Route path="/orders" element={<Orders/>}/>
        <Route path="/rentals" element={<StudentRentals/>}/>
        <Route path="/points" element={<Points/>}/>
      </Route>

      <Route element={<PrivateLayout/>}>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/admin/see-requests" element={<AdminUniversityRequest/>}/>
        <Route path="/admin/plans" element={<Plans/>}/>
        <Route path="/admin/plans/create" element={<PlansCreate/>}/>
        <Route path="/admin/plans/update/:id" element={<PlansUpdate/>}/>
        <Route path="/admin/payment-methods" element={<PaymentMethods/>}/>
        <Route path="/admin/payment-methods/create" element={<PaymentMethodsCreate/>}/>
        <Route path="/admin/payment-methods/update/:id" element={<PaymentMethodsUpdate/>}/>
        <Route path="/admin/brands" element={<Brands/>}/>
        <Route path="/admin/brands/create" element={<BrandsCreate/>}/>
        <Route path="/admin/brands/update/:id" element={<BrandsUpdate/>}/>
        <Route path="/admin/specialties" element={<Specialties/>}/>
        <Route path="/admin/specialties/create" element={<SpecialtiesCreate/>}/>
        <Route path="/admin/specialties/update/:id" element={<SpecialtiesUpdate/>}/>
        <Route path="/admin/sub-specialties" element={<SubSpecialties/>}/>
        <Route path="/admin/sub-specialties/create" element={<SubSpecialtiesCreate/>}/>
        <Route path="/admin/sub-specialties/update/:id" element={<SubSpecialtiesUpdate/>}/>
        <Route path="/admin/categories" element={<Categories/>}/>
        <Route path="/admin/categories/create" element={<CategoriesCreate/>}/>
        <Route path="/admin/categories/update/:id" element={<CategoriesUpdate/>}/>
        <Route path="/admin/product-types" element={<ProductTypes/>}/>
        <Route path="/admin/product-types/create" element={<ProductTypesCreate/>}/>
        <Route path="/admin/product-types/update/:id" element={<ProductTypesUpdate/>}/>
        <Route path="/admin/category-hierarchy" element={<CategoryHierarchy/>}/>
        <Route path="/admin/products" element={<ProductsList/>}/>
        <Route path="/admin/products/create" element={<ProductsCreate/>}/>
        <Route path="/admin/products/update/:id" element={<ProductsUpdate/>}/>
        <Route path="/admin/rentals" element={<Rentals/>}/>
      </Route>
    </Routes>

     {state?.backgroundLocation && (
        <Routes>
          <Route path="/admin/plans/create" element={<PlansCreate />} />
          <Route path="/admin/plans/update/:id" element={<PlansUpdate />} />
          <Route path="/admin/payment-methods/create" element={<PaymentMethodsCreate />} />
          <Route path="/admin/payment-methods/update/:id" element={<PaymentMethodsUpdate />} />
          <Route path="/admin/brands/create" element={<BrandsCreate />} />
          <Route path="/admin/brands/update/:id" element={<BrandsUpdate />} />
          <Route path="/admin/specialties/create" element={<SpecialtiesCreate />} />
          <Route path="/admin/specialties/update/:id" element={<SpecialtiesUpdate />} />
          <Route path="/admin/sub-specialties/create" element={<SubSpecialtiesCreate />} />
          <Route path="/admin/sub-specialties/update/:id" element={<SubSpecialtiesUpdate />} />
          <Route path="/admin/categories/create" element={<CategoriesCreate />} />
          <Route path="/admin/categories/update/:id" element={<CategoriesUpdate />} />
          <Route path="/admin/product-types/create" element={<ProductTypesCreate />} />
          <Route path="/admin/product-types/update/:id" element={<ProductTypesUpdate />} />
          <Route path="/admin/products/create" element={<ProductsCreate />} />
          <Route path="/admin/products/update/:id" element={<ProductsUpdate />} />
        </Routes>
      )}  
      </>
    );
}