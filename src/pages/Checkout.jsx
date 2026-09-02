import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useAuth } from '../contexts/AuthContext';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const bookingData = location.state || {};
  const {
    courtId,
    courtName,
    courtLocation,
    selectedDate,
    selectedSlots = [],
    totalPrice = 0,
  } = bookingData;

  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // STATE MODAL AUTH
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('register'); // 'login' atau 'register'
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // FORM AUTH STATES
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  if (!courtId || selectedSlots.length === 0) {
    return (
      <div className="min-h-screen bg-[#1c1d1f] text-white flex flex-col justify-center items-center font-sans gap-4">
        <p className="text-gray-400 font-bold">Tidak ada data booking yang dipilih.</p>
        <button
          onClick={() => navigate('/katalog')}
          className="bg-[#ccff00] text-black px-5 py-2.5 rounded-xl font-bold text-sm"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  // CORE LOGIC: SIMPAN BOOKING KE BACKEND
  const executeBooking = async (activeUser) => {
    setLoading(true);
    setError(null);

    const sortedHours = selectedSlots.map((s) => s.hour).sort((a, b) => a - b);
    const startHour = sortedHours[0];
    const endHour = sortedHours[sortedHours.length - 1] + 1;

    const payload = {
      users_id: activeUser.id,
      courts_id: courtId,
      booking_date: selectedDate,
      start_time: `${startHour.toString().padStart(2, '0')}:00:00`,
      end_time: `${endHour.toString().padStart(2, '0')}:00:00`,
      total_price: totalPrice,
      payment_method: paymentMethod,
    };

    try {
      await axiosClient.post('/bookings', payload);
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/katalog');
        }}
      />
      navigate('/history');
    } catch (err) {
      console.error(err);
      const apiMsg = err.response?.data?.message || 'Gagal memproses booking. Silakan coba lagi.';
      setError(apiMsg);
    } finally {
      setLoading(false);
    }
  };

  // TRIGGER TOMBOL BAYAR SEKARANG
  const handleProcessBooking = () => {
    // Kalau belum login, munculkan Modal Auth dulu
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // Jika sudah login, eksekusi booking
    executeBooking(user);
  };

  // HANDLER SUBMIT AUTH DALAM MODAL
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const endpoint = authMode === 'register' ? '/auth/register' : '/auth/login';
    const payload =
      authMode === 'register'
        ? { name, email, role: 'customer', password, password_confirmation: passwordConfirmation }
        : { email, password };

    try {
      const { data } = await axiosClient.post(endpoint, payload);
      const loggedUser = data.data.user;
      
      // Simpan credential
      localStorage.setItem('ACCESS_TOKEN', data.data.token);
      localStorage.setItem('USER_DATA', JSON.stringify(loggedUser));
      setUser(loggedUser);

      // Tutup modal
      setShowAuthModal(false);

      // Auto eksekusi booking membawa user yang baru login/register!
      executeBooking(loggedUser);
    } catch (err) {
      console.error(err);
      const apiErr = err.response?.data?.errors;
      const msg = typeof apiErr === 'object'
        ? Object.values(apiErr).flat().join('\n')
        : err.response?.data?.message || 'Autentikasi gagal!';
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1d1f] text-white font-sans py-10 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-gray-400 hover:text-white mb-2 flex items-center gap-1 font-semibold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </button>
          <h1 className="text-2xl sm:text-3xl font-black">Konfirmasi & Pembayaran</h1>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-800 text-red-300 p-4 rounded-xl text-sm font-semibold whitespace-pre-line">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT CONTENT */}
          <div className="md:col-span-2 space-y-6">
            {/* DETAIL LAPANGAN */}
            <div className="bg-[#252629] p-5 rounded-2xl border border-gray-800 space-y-3">
              <h3 className="text-xs font-bold text-[#ccff00] uppercase tracking-wider">Detail Lapangan</h3>
              <h2 className="text-xl font-bold">{courtName}</h2>
              <p className="text-xs text-gray-400 flex items-center gap-1">📍 {courtLocation}</p>
            </div>

            {/* RINCIAN JADWAL */}
            <div className="bg-[#252629] p-5 rounded-2xl border border-gray-800 space-y-4">
              <h3 className="text-xs font-bold text-[#ccff00] uppercase tracking-wider">Jadwal yang Dipilih</h3>
              <div className="flex justify-between items-center text-sm border-b border-gray-800 pb-3">
                <span className="text-gray-400">Tanggal Main:</span>
                <span className="font-bold">{selectedDate}</span>
              </div>
              <div className="space-y-2">
                <span className="text-xs text-gray-400">Slot Jam ({selectedSlots.length}):</span>
                <div className="flex flex-wrap gap-2">
                  {selectedSlots.map((slot) => (
                    <span key={slot.hour} className="bg-[#18191c] border border-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium">
                      {slot.time} (Rp{slot.price.toLocaleString('id-ID')})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* METODE PEMBAYARAN */}
            <div className="bg-[#252629] p-5 rounded-2xl border border-gray-800 space-y-4">
              <h3 className="text-xs font-bold text-[#ccff00] uppercase tracking-wider">Pilih Metode Pembayaran</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between gap-3 ${
                    paymentMethod === 'qris' ? 'bg-[#ccff00]/10 border-[#ccff00]' : 'bg-[#18191c] border-gray-800 text-gray-400'
                  }`}
                >
                  <span className="text-xs font-bold">QRIS / E-Wallet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between gap-3 ${
                    paymentMethod === 'bank_transfer' ? 'bg-[#ccff00]/10 border-[#ccff00]' : 'bg-[#18191c] border-gray-800 text-gray-400'
                  }`}
                >
                  <span className="text-xs font-bold">Transfer Bank</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="space-y-6">
            <div className="bg-[#252629] p-6 rounded-2xl border border-gray-800 space-y-5 sticky top-6">
              <h3 className="text-lg font-bold border-b border-gray-800 pb-3">Ringkasan Biaya</h3>
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">Total Bayar</span>
                <span className="text-2xl font-black text-[#ccff00]">
                  Rp{totalPrice.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                onClick={handleProcessBooking}
                disabled={loading}
                className="w-full bg-[#ccff00] hover:bg-[#b3e600] text-black font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {loading ? 'Memproses...' : 'Bayar Sekarang'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ================= MODAL AUTHENTICATION ================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#252629] border border-gray-800 w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-5 text-white shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black">Satu Langkah Lagi!</h2>
              <p className="text-xs text-gray-400">
                Silakan {authMode === 'register' ? 'Daftar' : 'Login'} untuk menyelesaikan booking kamu.
              </p>
            </div>

            {/* Switch Tab Register / Login */}
            <div className="flex bg-[#18191c] p-1 rounded-full border border-gray-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className={`flex-1 py-2 rounded-full transition-all ${
                  authMode === 'register' ? 'bg-[#ccff00] text-black' : 'text-gray-400'
                }`}
              >
                Daftar Akun
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`flex-1 py-2 rounded-full transition-all ${
                  authMode === 'login' ? 'bg-[#ccff00] text-black' : 'text-gray-400'
                }`}
              >
                Sudah Ada Akun
              </button>
            </div>

            {/* Error Alert */}
            {authError && (
              <div className="p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-xl text-center font-semibold whitespace-pre-line">
                {authError}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === 'register' && (
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#18191c] border border-gray-800 rounded-full px-4 py-3 text-xs focus:outline-none focus:border-[#ccff00]"
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#18191c] border border-gray-800 rounded-full px-4 py-3 text-xs focus:outline-none focus:border-[#ccff00]"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#18191c] border border-gray-800 rounded-full px-4 py-3 text-xs focus:outline-none focus:border-[#ccff00]"
                required
              />

              {authMode === 'register' && (
                <input
                  type="password"
                  placeholder="Konfirmasi Password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full bg-[#18191c] border border-gray-800 rounded-full px-4 py-3 text-xs focus:outline-none focus:border-[#ccff00]"
                  required
                />
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-[#ccff00] hover:bg-[#b3e600] text-black font-extrabold py-3.5 rounded-full text-xs uppercase tracking-wider transition-all disabled:opacity-50 mt-2"
              >
                {authLoading
                  ? 'Memproses...'
                  : authMode === 'register'
                  ? 'Daftar & Lanjut Bayar'
                  : 'Login & Lanjut Bayar'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}