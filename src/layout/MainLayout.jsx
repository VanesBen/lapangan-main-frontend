import { Outlet } from "react-router-dom";
import Navbar from "../components/molecules/Navbar";
import Footer from "../components/atomic/Footer";

export default function MainLayout() {
    return (
        <>
            <Navbar/>
            <Outlet/>
            <Footer/>
        </>
    )
}