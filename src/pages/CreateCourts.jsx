import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useAuth } from '../contexts/AuthContext';

export default function CreateCourts() {
  const navigate = useNavigate();
  const { setIsLoading, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    description: '',
    is_active: true,
    facilities: '',
    location: '',
    rules: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await axiosClient.post('/courts', formData);
      navigate('/admin/courts');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Gagal menambahkan data lapangan. Cek kembali inputan Anda.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111215] text-white flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
      <div className="w-full max-w-2xl bg-[#1d2229] border border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Tambah Lapangan
          </h1>
          <p className="text-gray-400 text-sm">
            Lengkapi data di bawah ini untuk mendaftarkan lapangan baru
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Field: Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Nama Lapangan
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Lapangan Futsal VVIP"
              className="w-full bg-[#13161b] border border-gray-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
            />
          </div>

          {/* Field: Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Lokasi / Kota
            </label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="Contoh: Jakarta Selatan"
              className="w-full bg-[#13161b] border border-gray-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
            />
          </div>

          {/* Field: Photo URL / Data URI */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Foto Lapangan (URL / Base64)
            </label>
            <input
              type="text"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              placeholder="https://... atau data:image/..."
              className="w-full bg-[#13161b] border border-gray-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
            />
          </div>

          {/* Field: Facilities */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Fasilitas
            </label>
            <input
              type="text"
              name="facilities"
              value={formData.facilities}
              onChange={handleChange}
              placeholder="Contoh: WiFi, Locker Room, Shower Air Hangat, Kantin"
              className="w-full bg-[#13161b] border border-gray-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
            />
          </div>

          {/* Field: Rules */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Peraturan Lapangan
            </label>
            <textarea
              name="rules"
              rows={3}
              value={formData.rules}
              onChange={handleChange}
              placeholder="Contoh: Wajib sepatu futsal sol karet, Dilarang merokok di area indoor"
              className="w-full bg-[#13161b] border border-gray-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition resize-none"
            />
          </div>

          {/* Field: Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Deskripsi
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Contoh: Lapangan Futsal Indoor Rumput Sintetis Super Premium standar nasional..."
              className="w-full bg-[#13161b] border border-gray-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition resize-none"
            />
          </div>

          {/* Field: Is Active (Checkbox / Switch) */}
          <div className="flex items-center justify-between bg-[#13161b] border border-gray-800 rounded-2xl px-4 py-3.5">
            <div>
              <p className="text-sm font-semibold text-white">Status Lapangan Aktif</p>
              <p className="text-xs text-gray-400">Aktifkan agar langsung muncul dan bisa disewa</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ccff00]"></div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#ccff00] hover:bg-[#b8e600] active:scale-[0.99] transition-all text-black font-extrabold py-3.5 rounded-full shadow-lg text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed uppercase"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Lapangan'}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full text-center text-xs text-gray-400 hover:text-white py-2 transition"
            >
              Batal dan Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}