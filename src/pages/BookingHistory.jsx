import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useAuth } from '../contexts/AuthContext';

export default function BookingHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

const fetchHistory = async () => {
    setLoading(true);
    try {
        const { data } = await axiosClient.get('/bookings');
        // Ambil dari data.data.items sesuai struktur response controller baru
        setBookings(data.data?.items || []); 
    } catch (err) {
        console.error(err);
        setError('Gagal mengambil data riwayat booking.');
    } finally {
        setLoading(false);
    }
    };

  // Helper Badge Status
  const renderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
            Selesai / Lunas
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            Menunggu Pembayaran
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-300 border border-gray-500/30">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1d1f] text-white font-sans py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-5">
          <div>
            <button
              onClick={() => navigate('/katalog')}
              className="text-xs text-gray-400 hover:text-white mb-2 flex items-center gap-1 font-semibold transition-colors"
            >
              ← Kembali ke Katalog
            </button>
            <h1 className="text-2xl sm:text-3xl font-black">Riwayat Booking</h1>
          </div>
          
          <button
            onClick={fetchHistory}
            className="bg-[#252629] hover:bg-gray-800 border border-gray-700 text-xs px-4 py-2 rounded-xl transition-all"
          >
            Refresh
          </button>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="text-center py-20 text-gray-400 space-y-3">
            <div className="w-8 h-8 border-4 border-[#ccff00] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-semibold">Memuat riwayat booking...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="bg-red-900/40 border border-red-800 text-red-300 p-4 rounded-2xl text-sm font-semibold text-center">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && bookings.length === 0 && (
          <div className="bg-[#252629] border border-gray-800 rounded-3xl p-10 text-center space-y-4">
            <div className="text-5xl">⚽</div>
            <h3 className="text-lg font-bold">Belum Ada Riwayat Booking</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Kamu belum pernah melakukan booking lapangan. Yuk pilih lapangan dan jadwal favoritmu sekarang!
            </p>
            <button
              onClick={() => navigate('/katalog')}
              className="bg-[#ccff00] text-black px-6 py-3 rounded-full font-extrabold text-xs uppercase tracking-wider hover:bg-[#b3e600] transition-all"
            >
              Sewa Lapangan Sekarang
            </button>
          </div>
        )}

        {/* LIST BOOKINGS */}
        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((item) => (
              <div
                key={item.id}
                className="bg-[#252629] border border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition-all space-y-4 shadow-lg"
              >
                {/* CARD HEADER */}
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono bg-[#18191c] text-[#ccff00] px-3 py-1 rounded-lg border border-gray-800 font-bold">
                      {item.booking_code || `BK-${item.id}`}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {renderStatusBadge(item.status)}
                </div>

                {/* CARD BODY */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {/* Lapangan */}
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Lapangan</span>
                    <p className="font-bold text-base text-white">{item.court?.name || 'Lapangan Main'}</p>
                    <p className="text-xs text-gray-400">📍 {item.court?.location || 'Jakarta'}</p>
                  </div>

                  {/* Jadwal */}
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Jadwal Main</span>
                    <p className="font-bold text-white">{item.booking_date}</p>
                    <p className="text-xs text-[#ccff00] font-mono">
                      ⏰ {item.start_time?.slice(0, 5)} - {item.end_time?.slice(0, 5)} WIB
                    </p>
                  </div>

                  {/* Pembayaran */}
                  <div className="space-y-1 md:text-right">
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Total & Metode</span>
                    <p className="text-lg font-black text-[#ccff00]">
                      Rp{Number(item.total_price).toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-gray-400 uppercase font-semibold">
                      💳 {item.payment?.payment_method || 'QRIS'}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}