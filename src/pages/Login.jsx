import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { setUser, setIsLoading, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmitting(false)
    setAlert({ type: "", message: "" });

    const payload = { email, password };

    axiosClient
      .post("/auth/login", payload)
      .then(({ data }) => {
        // Simpan Token & User
        localStorage.setItem("ACCESS_TOKEN", data.data.token);
        localStorage.setItem("USER_DATA", JSON.stringify(data.data.user));
        setUser(data.data.user);

        // Redirect sesuai Role
        const role = data.data.user.role;
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/katalog");
        }
      })
      .catch((err) => {
        console.error("Proses login error:", err);
        const response = err.response;

        if (response && response.status === 422) {
          const apiError = response.data.errors;
          const msg =
            typeof apiError === "object"
              ? Object.values(apiError).flat().join("\n")
              : response.data.message;

          setAlert({
            type: "error",
            message: msg || "Format email atau password salah!",
          });
        } else {
          setAlert({
            type: "error",
            message: response?.data?.message || "Email atau password salah!",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4 font-sans">
      {/* Card Container */}
      <div className="w-full max-w-[420px] bg-[#252629]/90 backdrop-blur-md border border-gray-800 rounded-[32px] p-8 md:p-10 text-white shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black tracking-tight mb-2 text-white">Login</h1>
          <p className="text-gray-400 text-sm font-light leading-relaxed">
            Selamat datang kembali di platform rental!
          </p>
        </div>

        {/* Alert Error Box */}
        {alert.message && (
          <div className="mb-5 p-3.5 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-2xl font-semibold whitespace-pre-line text-center">
            {alert.message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Input Email */}
          <div className="relative flex items-center">
            <div className="absolute left-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#18191c] border border-gray-800 text-white placeholder-gray-500 rounded-full py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#ccff00] transition-all"
              required
            />
          </div>

          {/* Input Password */}
          <div className="relative flex items-center">
            <div className="absolute left-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#18191c] border border-gray-800 text-white placeholder-gray-500 rounded-full py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:border-[#ccff00] transition-all"
              required
            />
            
            {/* Toggle Show/Hide Password */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              )}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#CCFF00] hover:bg-[#b3e600] active:scale-[0.99] text-black font-extrabold py-3.5 rounded-full transition-all text-sm uppercase tracking-wider shadow-md mt-2 disabled:opacity-50"
          >
            {isSubmitting ? "Memproses..." : "Login"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <Link to="/register" className="text-xs text-gray-400 hover:text-[#ccff00] font-medium transition-colors">
            Belum punya akun? <span className="underline">Daftar Sekarang</span>
          </Link>
        </div>

      </div>
    </div>
  );
}