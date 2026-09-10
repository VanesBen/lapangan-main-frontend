import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useAuth } from '../contexts/AuthContext';
import InputBox from '../components/atomic/InputBox';
import Dropdown from '../components/atomic/Dropdown';
import Button from '../components/atomic/Button';
import toast from 'react-hot-toast';
import PricingRuleCard from '../components/molecules/PricingRuleCard';

export default function CreateCourts() {
  const navigate = useNavigate();
  const { setIsLoading } = useAuth();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    category: '',
    description: '',
    is_active: true,
    facilities: '',
    location: '',
    rules: '',
  });

  // State untuk menampung aturan harga lokal dari PricingRuleCard
  const [pricingRules, setPricingRules] = useState([]);

  const CATEGORY_OPTIONS = [
    'Basket',
    'Futsal / Sepakbola',
    'Badminton',
    'Padel',
    'Tenis',
  ];

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value,
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData.photo)

    if (!formData.photo) {
      toast.error('Foto lapangan wajib dipilih dan tunggu sampai selesai diproses!');
      return;
    }
    
    if (pricingRules.length === 0) {
      toast.error('Minimal harus menambahkan 1 aturan jam & tarif sewa!');
      return;
    }

    setSaving(true);
    setIsLoading(true);

    try {
      await axiosClient.post('/courts', {
        ...formData,
        pricing_rules: pricingRules,
      });
      toast.success('Lapangan & aturan tarif berhasil dibuat!');
      navigate('/admin/courts');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Gagal menyimpan lapangan.');
    } finally {
      setIsLoading(false);
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-neutral-400 hover:text-white mb-2 flex items-center gap-1.5 transition-colors"
            >
              &larr; Kembali ke Daftar Lapangan
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">Tambah Lapangan Baru</h1>
          </div>
        </div>

        {/* 1. Form Data Lapangan */}
        <form id="court-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#1e1e1e] border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-lg font-bold">Informasi Lapangan</h2>

            <InputBox
              title="Nama Lapangan"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Lapangan Futsal VVIP"
              required
            />

            <Dropdown
              title="Kategori Lapangan"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={CATEGORY_OPTIONS}
              placeholder="Pilih Kategori Lapangan"
            />

            <InputBox
              title="Lokasi / Kota"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="Contoh: Jakarta Selatan"
              required
            />

            <InputBox 
              title="Foto Lapangan" 
              name="photo" 
              type="file"
              onChange={handleChange} 
            />

            <InputBox
              title="Fasilitas (Pisahkan dengan koma)"
              name="facilities"
              type="text"
              value={formData.facilities}
              onChange={handleChange}
              placeholder="WiFi, AC, Shower"
            />

            <InputBox
              title="Peraturan"
              name="rules"
              type="text"
              value={formData.rules}
              onChange={handleChange}
              placeholder="Dilarang membawa makanan luar"
            />

            <InputBox
              title="Deskripsi"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              placeholder="Deskripsi fasilitas dan keunggulan lapangan"
            />
          </div>
        </form>

        {/* 2. Section Aturan Jam & Tarif Sewa */}
        <PricingRuleCard 
          pricingRules={pricingRules} 
          onChange={setPricingRules} 
        />

        {/* 3. Action Buttons di Paling Bawah */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-800">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Batal
          </button>
          <Button
            onClick={handleSubmit}
            title={saving ? 'Menyimpan Semua...' : 'Buat Lapangan'}
            disabled={saving}
          />
        </div>

      </div>
    </div>
  );
}