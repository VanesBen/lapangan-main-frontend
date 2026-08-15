import { Outlet } from "react-router-dom";
import Navbar from "../components/molecules/Navbar";

export default function MainLayout() {
    return (
        <>
            <Navbar/>
            <Outlet/>
        </>
    )
}