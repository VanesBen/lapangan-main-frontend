import { Link, useNavigate } from "react-router-dom";
import LogoImg from "../../assets/image/Logo.png"
import Button from "../atomic/Button";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    // const { user, logout } = useAuth();
    const isLoggedIn = false;

    const linksGuest = [
        { path: "/products", link_name: "Explore Products" },
        { path: "/categories", link_name: "Explore Category" },
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
            return linksAdmin
        }
        return linksBuyer;
    };

    const activeLinks = getActiveLinks();

    // function handleLogin() {
    //     navigate('/login');
    // }

    // function handleLogout() {
    //     logout();
    //     navigate('/');
    // }

    return (
        <nav className=" nav flex justify-between items-center text-xl gap-10 px-10 bg-[#1E1E1E] ">
            <div className="">
                <Link>
                <img src={LogoImg} className="h-30" alt="" />
                </Link>
            </div>

            <div className="flex hidden md:flex items-center gap-10">
                <ul className="hidden md:flex items-center gap-10">
                    {
                        activeLinks.map((item) => {
                            <li>
                                <Link>PESAN LAPANGAN</Link>
                            </li>
                        })
                    }
                </ul>
                <Link>PESAN LAPANGAN</Link>
                <Link>TENTANG KAMI</Link>
                <Link>KEUNGGULAN KAMI</Link>
                <Button title={"Login"}></Button>
            </div>



            <button className="btn btn-square btn-ghost md:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
            </button>
            
        </nav>

        
    )
}