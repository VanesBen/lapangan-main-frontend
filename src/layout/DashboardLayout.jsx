import React, { useState } from 'react';
import logoImg from "../assets/image/Logo.png"
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    setUser(null);
    navigate('/login');
  };

  // Navigasi Menu Admin
  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinecap="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      name: 'Kelola Lapangan',
      path: '/admin/courts',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinecap="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#141517] text-white flex font-sans">
      {/* 1. SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1c1d1f] border-r border-gray-800 shrink-0">
        {/* Brand Logo */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <Link to="/admin" className="text-xl font-black tracking-wider text-[#ccff00] flex items-center gap-2">
            <img className='h-30' src={logoImg} alt="" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? 'bg-[#ccff00] text-black font-bold shadow-lg shadow-[#ccff00]/10'
                    : 'text-gray-400 hover:bg-[#252629] hover:text-white'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info & Quick Exit */}
        <div className="p-4 border-t border-gray-800">
          <Link
            to="/katalog"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#252629] hover:bg-gray-800 text-gray-300 rounded-xl text-xs font-bold transition-all mb-2"
          >
            🌐 Lihat Web Client
          </Link>
        </div>
      </aside>

      {/* 2. MOBILE DRAWER OVERLAY */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* 3. SIDEBAR MOBILE */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-[#1c1d1f] border-r border-gray-800 z-50 transform transition-transform duration-300 md:hidden flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <img className='h-30' src={logoImg} alt="" />
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? 'bg-[#ccff00] text-black font-bold'
                    : 'text-gray-400 hover:bg-[#252629] hover:text-white'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* 4. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER BAR */}
        <header className="h-16 bg-[#1c1d1f] border-b border-gray-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-gray-400 hover:text-white bg-[#252629] rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-sm font-bold text-gray-400 hidden sm:block">
              Selamat datang kembali, <span className="text-white">{user?.name || 'Administrator'}</span>
            </h2>
          </div>

          {/* Profile & Logout */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20 px-3 py-1 rounded-full uppercase">
              {user?.role || 'Admin'}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-400 text-xs font-bold px-4 py-2 rounded-xl transition-all"
            >
              Logout
            </button>
          </div>
        </header>

        {/* SUB PAGE RENDER HERE */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}