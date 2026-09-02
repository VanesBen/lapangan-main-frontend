import { Link, useNavigate } from "react-router-dom";
import LogoImg from "../../assets/image/Logo.png"
import Button from "../atomic/Button";
import { useState } from "react";
// Import LogoImg & Button sesuai setup kamu

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const isLoggedIn = false;

    const linksGuest = [
        { path: "/katalog", link_name: "PESAN LAPANGAN" },
        { path: "/categories", link_name: "KEUNGGULAN KAMI" },
        { path: "/categories", link_name: "" },
    ];

    const linksSeller = [];

    const linksBuyer = [
        { path: "/user/katalog", link_name: "Explore Products" },
        { path: "/user/order", link_name: "My Orders" },
        { path: "/user/cart", link_name: "Cart" }
    ];

    const linksAdmin = [];

    const getActiveLinks = () => {
        if (!isLoggedIn) return linksGuest;

        if (user?.role === 'seller') {
            return linksSeller;
        } else if (user?.role === 'admin') {
            return linksAdmin;
        }
        return linksBuyer;
    };

    const activeLinks = getActiveLinks();

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <nav className="nav relative flex justify-between items-center text-xl gap-10 px-10 bg-[#1E1E1E]">
            <div>
                <Link to="/">
                    <img src={LogoImg} className="h-30" alt="Logo" />
                </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10">
                <ul className="hidden md:flex items-center gap-10">
                    {activeLinks.map((item, index) => (
                        <li key={index}>
                            <Link to={item.path}>{item.link_name}</Link>
                        </li>
                    ))}
                </ul>
                <Button onClick={() => {navigate("/login")}} title={"Login"} />
            </div>

            {/* Mobile Hamburger Button */}
            <button 
                onClick={toggleMenu} 
                aria-label="Toggle menu"
                className="btn btn-square btn-ghost md:hidden"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-[#1E1E1E] flex flex-col items-start gap-4 p-6 md:hidden z-50 border-t border-gray-800">
                    <ul className="flex flex-col gap-4 w-full">
                        {activeLinks.map((item, index) => (
                            <li key={index}>
                                <Link to={item.path} onClick={() => setIsOpen(false)}>
                                    {item.link_name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="pt-2 w-full">
                        <Button title={"Login"} />
                    </div>
                </div>
            )}
        </nav>
    );
}