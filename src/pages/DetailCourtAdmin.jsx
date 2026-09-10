import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import Button from "../components/atomic/Button";
import InputBox from "../components/atomic/InputBox";
import Dropdown from "../components/atomic/Dropdown";
import PricingRuleCard from "../components/molecules/PricingRuleCard";
import toast from "react-hot-toast";

export default function AdminCourtDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [pricingRules, setPricingRules] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    category:"",
    description: "",
    is_active: "true",
    facilities: "",
    location: "",
    rules: "",
  });

  const CATEGORY_OPTIONS = [
    'Basket',
    'Futsal / Sepakbola',
    'Badminton',
    'Padel',
    'Tenis',
  ];

  const scrollToPricing = () => {
    document.getElementById('pricing-rules-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch detail 
  const fetchCourtDetail = () => {
    setLoading(true);
    axiosClient
      .get(`/courts/${id}`)
      .then(({ data }) => {
        const court = data.data || data;
        setFormData({
          name: court.name || "",
          photo: court.photo || "",
          category: court.category || "",
          description: court.description || "",
          is_active: court.is_active === true || court.is_active === "true" || court.is_active === 1,
          facilities: court.facilities || "",
          location: court.location || "",
          rules: court.rules || "",
        });
        setPricingRules(court.prices || []);
      })
      .catch((err) => {
        console.error("Gagal memuat detail court:", err);
      })
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    if (id) {
      fetchCourtDetail();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      is_active: Boolean(formData.is_active)
    }

    if (typeof payload.photo === 'string' && payload.photo.includes('fakepath')) {
      delete payload.photo;
    }

    axiosClient
      .patch(`/courts/${id}`, payload)
      .then(() => {
        toast.success("Informasi lapangan berhasil diperbarui!")
        navigate("/admin/courts"); // arahkan balik ke list court admin
      })
      .catch((err) => {
        if (err.response && err.response.data?.errors) {
          toast.error(err.response.data.errors)
        } else {
          toast.error("Terjadi kesalahan saat menyimpan perubahan.")
        }
      })
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center text-white">
        <p className="animate-pulse text-lg">Memuat data lapangan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white p-6 md:p-10">
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header Section */}
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <button
            type="button"
            onClick={() => navigate('/admin/courts')}
            className="text-sm text-neutral-400 hover:text-white mb-2 flex items-center gap-1.5 transition-colors"
          >
            &larr; Kembali ke Daftar Lapangan
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">Edit Detail Lapangan</h1>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            formData.is_active
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}
        >
          {formData.is_active ? "Status: Aktif" : "Status: Nonaktif"}
        </span>
      </div>



      {/* Two-Column Layout: Info & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-6 border-b border-neutral-800">
        
        {/* Kolom Kiri: Live Preview Lapangan + CTA Quick Jump */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Preview Lapangan
          </h2>

          <div className="bg-[#1e1e1e] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="h-48 w-full bg-neutral-900 overflow-hidden flex items-center justify-center">
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-neutral-500">Tidak ada gambar</span>
              )}
            </div>

            <div className="p-5 space-y-3">
              <h3 className="text-lg font-bold text-white">{formData.name || "Nama Lapangan"}</h3>
              
              {/* Kategori */}
              <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-emerald-400 shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A4.494 4.494 0 0110.5 15.5v1.5H8.25a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H13.5v-1.5a4.494 4.494 0 01.108-3.632 6.73 6.73 0 002.743-1.346 6.753 6.753 0 006.138-5.6.75.75 0 00-.584-.859 47.78 47.78 0 00-3.071-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.616c-.073.377-.118.76-.134 1.148a5.253 5.253 0 01-1.996-2.584c.69-.142 1.39-.267 2.13-.374zm13.668 0c.74.107 1.44.232 2.13.374a5.253 5.253 0 01-1.996 2.584 13.714 13.714 0 01-.134-1.148z"
                    clipRule="evenodd"
                  />
                </svg>
                {formData.category || "Kategori belum dipilih"}
              </p>

              {/* Lokasi */}
              <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-400 shrink-0">
                  <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                {formData.location || "Lokasi belum ditentukan"}
              </p>

              <p className="text-xs text-neutral-300 line-clamp-3">
                {formData.description || "Deskripsi singkat lapangan akan muncul di sini."}
              </p>
            </div>

            {/* CTA Box yang memicu Scroll Halus ke Tabel Aturan Jam */}
            <div className="p-4 bg-neutral-900/80 border-t border-neutral-800">
              <button
                type="button"
                onClick={scrollToPricing}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 active:scale-[0.98] transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-emerald-300">Aturan Jam & Tarif</p>
                    <p className="text-[11px] text-neutral-400">Lihat & edit slot harga</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold">
                  <span className="text-neutral-500 group-hover:text-emerald-400 transition-colors">&darr;</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Form Edit Informasi */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-[#1e1e1e] border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6"
          >
            <InputBox 
              title="Nama" 
              name="name" 
              type="text" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Contoh: Lapangan Futsal VVIP"
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
              placeholder="Contoh: Jakarta Utara"
            />

            <InputBox 
              title="Foto Lapangan" 
              name="photo" 
              type="file" 
              onChange={handleChange} 
            />

            <InputBox 
              title="Fasilitas (PISAHKAN DENGAN KOMA , )" 
              name="facilities" 
              type="text" 
              value={formData.facilities} 
              onChange={handleChange} 
              placeholder="Contoh: WiFi, AC, Shower"
            />

            <InputBox 
              title="Peraturan" 
              name="rules" 
              type="text" 
              value={formData.rules} 
              onChange={handleChange} 
              placeholder="Contoh: Dilarang membawa makanan dari luar"
            />

            <InputBox 
              title="Deskripsi" 
              name="description" 
              type="text" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Lapangan Futsal VVIP paling bagus"
            />

            {/* Status Switch (is_active) */}
            <div className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-white">Status Lapangan</p>
                <p className="text-xs text-neutral-400">
                  Jika tidak aktif, lapangan tidak akan muncul pada katalog customer.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={Boolean(formData.is_active)}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                Batal
              </button>
              <Button 
                type="submit" 
                title={saving ? "Menyimpan..." : "Update"} 
                disabled={saving}
              />
            </div>
          </form>
        </div>

      </div>

      {/* Section Bawah: Aturan Jam & Tarif (Pricing Rules) */}
      <PricingRuleCard courtId={id} pricingRules={pricingRules} onRefresh={fetchCourtDetail}/>

    </div>
  </div>
  );
}