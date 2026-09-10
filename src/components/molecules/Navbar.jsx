import { Link, useNavigate } from "react-router-dom";
import LogoImg from "../../assets/image/Logo.png";
import Button from "../atomic/Button";
import { useState } from "react";
// Sesuaikan import Context lo kalau pakai state global (misal: useAuth / useStateContext)

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Ambil token / user dari storage atau context lo
  // Jika pakai state/context auth, ganti dengan: const { user, token, setUser, setToken } = useAuth();
  const token = localStorage.getItem("ACCESS_TOKEN");
  const isLoggedIn = !!token;

  // Handler Logout
  const handleLogout = () => {
    // 1. Hapus kredensial
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("USER");

    // 2. Arahkan kembali ke login / home
    setIsOpen(false);
    navigate("/login");
  };

  const linksGuest = [
    { path: "/katalog", link_name: "PESAN LAPANGAN" }
  ];

  const linksUser = [
    { path: "/katalog", link_name: "PESAN LAPANGAN" },
    { path: "/customer/history", link_name: "RIWAYAT PEMESANAN" },
  ];

  const activeLinks = isLoggedIn ? linksUser : linksGuest;

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="nav relative flex justify-between items-center text-xl gap-10 px-10 py-5 bg-[#1E1E1E] text-white">
      <div>
        <Link to="/">
          <img src={LogoImg} className="h-25 object-contain" alt="Logo" />
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-10">
        <ul className="flex items-center gap-8 text-base font-medium">
          {activeLinks.map((item, index) => (
            <li key={index} className="hover:text-blue-400 transition-colors">
              <Link to={item.path}>{item.link_name}</Link>
            </li>
          ))}
        </ul>

        {isLoggedIn ? (
            <div className="flex items-center gap-4">
                {/* User Profile Pill */}
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <div className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center text-gray-300">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-4 h-4"
                    >
                        <path 
                        fillRule="evenodd" 
                        d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" 
                        clipRule="evenodd" 
                        />
                    </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-200 pr-1">Customer</span>
                </div>

                {/* Tombol Logout Ramping */}
                <button
                    type="button"
                    onClick={handleLogout}
                    className="text-lg font-semibold px-3.5 py-2 rounded-xl border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/50 transition-all"
                >
                    Logout
                </button>
            </div>
          
        ) : (
          <Button 
            onClick={() => navigate("/login")} 
            title="Login" 
          />
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <button 
        onClick={toggleMenu} 
        aria-label="Toggle menu"
        className="btn btn-square btn-ghost md:hidden text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#1E1E1E] flex flex-col items-start gap-4 p-6 md:hidden z-50 border-t border-gray-800">
          <ul className="flex flex-col gap-4 w-full text-base">
            {activeLinks.map((item, index) => (
              <li key={index}>
                <Link to={item.path} onClick={() => setIsOpen(false)}>
                  {item.link_name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="pt-2 w-full">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                {/* User Profile Pill */}
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <div className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center text-gray-300">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-4 h-4"
                    >
                        <path 
                        fillRule="evenodd" 
                        d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" 
                        clipRule="evenodd" 
                        />
                    </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-200 pr-1">Customer</span>
                </div>

                {/* Tombol Logout Ramping */}
                <button
                    type="button"
                    onClick={handleLogout}
                    className="text-lg font-semibold px-3.5 py-2 rounded-xl border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/50 transition-all"
                >
                    Logout
                </button>
            </div>
            ) : (
              <Button 
                onClick={() => {
                  setIsOpen(false);
                  navigate("/login");
                }} 
                title="Login" 
                className="w-full"
              />
            )}
          </div>
        </div>
      )}
    </nav>
  );
}