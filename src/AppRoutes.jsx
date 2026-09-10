import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Katalog from "./pages/Katalog";
import DetailCourt from "./pages/DetailCourt";
import Checkout from "./pages/Checkout";
import DashboardLayout from "./layout/DashboardLayout";
import ProtectedRoute from "./components/atomic/ProtectedRoutes";
import Register from "./pages/Register";
import BookingHistory from "./pages/BookingHistory";
import AdminCourts from "./pages/AdminCourts";
import CreateCourts from "./pages/CreateCourts";
import DetailCourtAdmin from "./pages/DetailCourtAdmin";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/katalog" element={<Katalog/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/checkout" element={<Checkout/>} />
                <Route path="/katalog/:id" element={<DetailCourt/>} />
                <Route element={<ProtectedRoute allowedRoles={"customer"}/>}>
                    <Route path="/customer/history" element={<BookingHistory/>}/>
                </Route>
            </Route>
            <Route element={<ProtectedRoute allowedRoles={"admin"}/>}>
                <Route element={<DashboardLayout/>}>
                    <Route path="/admin" element={<BookingHistory/>}/>
                    <Route path="/admin/courts" element={<AdminCourts/>}/>
                    <Route path="/admin/courts/:id" element={<DetailCourtAdmin/>}/>
                    <Route path="/admin/courts/create" element={<CreateCourts/>}/>
                </Route>
            </Route>
        </Routes>
    )
}