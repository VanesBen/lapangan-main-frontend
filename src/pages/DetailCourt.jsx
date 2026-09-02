import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client';
import Button from '../components/atomic/Button';

export default function DetailCourt() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [court, setCourt] = useState(null);
    const [pricingRules, setPricingRules] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [selectedSlots, setSelectedSlots] = useState([]);

    // 1. Fetch Data Court & Pricing Rules secara Paralel
    useEffect(() => {
        setLoading(true);
        
        Promise.all([
        axiosClient.get(`/courts/${id}`),
        axiosClient.get('/pricings')
        ])
        .then(([courtRes, pricingRes]) => {
            // Unpack Data Court
            const courtData = courtRes.data.data || courtRes.data;
            setCourt(courtData);

            // Unpack & Filter Pricing Rules Khusus Lapangan Ini
            const allPricings = pricingRes.data.data?.items || pricingRes.data?.items || [];
            const courtPricings = allPricings.filter(
            (rule) => String(rule.courts_id) === String(id)
            );
            setPricingRules(courtPricings);
        })
        .catch((err) => {
            console.error(err);
            setError('Gagal mengambil data detail/harga lapangan.');
        })
        .finally(() => {
            setLoading(false);
        });
    }, [id]);


    useEffect(() => {
        if (pricingRules.length === 0) return;

        // Cek Jenis Hari (0 = Minggu, 6 = Sabtu -> Weekend)
        const dateObj = new Date(selectedDate);
        const dayOfWeek = dateObj.getDay();
        const currentDayType = (dayOfWeek === 0 || dayOfWeek === 6) ? 'weekend' : 'weekday';

        const activeRules = pricingRules.filter(
        (rule) => rule.day_type.toLowerCase() === currentDayType
        );

        const generatedSlots = [];

        activeRules.forEach((rule) => {
        for (let hour = rule.start_hour; hour < rule.end_hour; hour++) {
            const startFormatted = hour.toString().padStart(2, '0') + ':00';
            const endFormatted = (hour + 1).toString().padStart(2, '0') + ':00';

            generatedSlots.push({
            hour: hour,
            time: `${startFormatted} - ${endFormatted}`,
            price: rule.price_per_hour,
            isBooked: false, // Nanti dikawinkan dengan API Bookings
            });
        }
        });

        // Urutkan slot berdasarkan jam
        generatedSlots.sort((a, b) => a.hour - b.hour);
        setTimeSlots(generatedSlots);
    }, [selectedDate, pricingRules]);

    const handleSelectSlot = (slot) => {
        if (slot.isBooked) return;
        const isAlreadySelected = selectedSlots.some((s) => s.hour === slot.hour);
        if (isAlreadySelected) {
        setSelectedSlots(selectedSlots.filter((s) => s.hour !== slot.hour));
        } else {
        setSelectedSlots([...selectedSlots, slot]);
        }
    };

    const totalPrice = selectedSlots.reduce((sum, slot) => sum + slot.price, 0);

    if (loading) {
        return (
        <div className="min-h-screen bg-[#1c1d1f] text-white flex justify-center items-center font-sans">
            <p className="text-lg font-semibold animate-pulse text-gray-400">
            Memuat Detail & Slot Harga...
            </p>
        </div>
        );
    }

    if (error || !court) {
        return (
        <div className="min-h-screen bg-[#1c1d1f] text-white flex flex-col justify-center items-center font-sans gap-4">
            <p className="text-red-500 font-bold">{error || 'Lapangan tidak ditemukan.'}</p>
            <button
            onClick={() => navigate('/katalog')}
            className="bg-[#ccff00] text-black px-4 py-2 rounded-lg font-bold text-sm"
            >
            Kembali ke Katalog
            </button>
        </div>
        );
    }

    const facilitiesList = court.facilities ? court.facilities.split(',').map((f) => f.trim()) : [];
    const rulesList = court.rules ? court.rules.split(',').map((r) => r.trim()) : [];

    return (
        <div className="min-h-screen bg-[#1c1d1f] text-white font-sans pb-28">
        {/* BANNER */}
        <div className="w-full h-52 sm:h-72 md:h-96 overflow-hidden bg-gray-800">
            <img
            src={court.photo || 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1200&auto=format&fit=crop'}
            alt={court.name}
            className="w-full h-full object-cover"
            />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
            {/* HEADER */}
            <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{court.name}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-yellow-400 font-bold">★ 4.9</span>
                <span>•</span>
                <span>{court.location}</span>
            </div>
            </div>

            <hr className="border-gray-800" />

            {/* DESKRIPSI & ATURAN */}
            <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold mb-1">Deskripsi</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{court.description}</p>
            </div>

            <div>
                <h3 className="text-lg font-bold mb-2">Aturan Venue</h3>
                <ul className="text-sm text-gray-300 space-y-1 list-disc pl-5">
                {rulesList.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                ))}
                </ul>
            </div>
            </div>

            <hr className="border-gray-800" />

            {/* FASILITAS */}
            <div>
            <h3 className="text-lg font-bold mb-4">Fasilitas</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {facilitiesList.map((fac, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-[#252629] p-3 rounded-xl border border-gray-800 text-sm">
                    <span className="text-xl">⚡</span>
                    <span className="text-gray-200 font-medium">{fac}</span>
                </div>
                ))}
            </div>
            </div>

            <hr className="border-gray-800" />

            {/* SELECT DATE & DYNAMIC SLOTS */}
            <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#252629] p-5 rounded-2xl border border-gray-800">
                <div>
                <h3 className="text-lg font-bold">Pilih Tanggal Main</h3>
                <p className="text-xs text-gray-400">Harga dan slot jam otomatis menyesuaikan weekday/weekend</p>
                </div>
                <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlots([]);
                }}
                className="bg-[#18191c] text-white border border-gray-700 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#ccff00]"
                />
            </div>

            {/* GRID TIME SLOTS */}
            {timeSlots.length === 0 ? (
                <p className="text-center text-gray-400 py-6">Tidak ada slot jadwal yang tersedia pada tanggal ini.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {timeSlots.map((slot) => {
                    const isSelected = selectedSlots.some((s) => s.hour === slot.hour);
                    return (
                    <button
                        key={slot.hour}
                        disabled={slot.isBooked}
                        onClick={() => handleSelectSlot(slot)}
                        className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                        slot.isBooked
                            ? 'bg-red-950/20 border-red-900/40 text-red-500 cursor-not-allowed opacity-50'
                            : isSelected
                            ? 'bg-[#ccff00] border-[#ccff00] text-black font-bold scale-[1.02]'
                            : 'bg-[#252629] border-gray-800 text-white hover:border-gray-600'
                        }`}
                    >
                        <span className="text-xs font-medium">60 Menit</span>
                        <span className="text-sm font-bold">{slot.time}</span>
                        <span className={`text-xs ${isSelected ? 'text-black' : 'text-gray-400'}`}>
                        Rp{slot.price.toLocaleString('id-ID')}
                        </span>
                    </button>
                    );
                })}
                </div>
            )}
            </div>
        </div>

        {/* STICKY BOTTOM BAR */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#18191c]/95 backdrop-blur-md border-t border-gray-800 p-4 z-50">
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div>
                <p className="text-xs text-gray-400">{selectedSlots.length} Slot Dipilih</p>
                <p className="text-xl sm:text-2xl font-black text-[#ccff00]">
                Rp{totalPrice.toLocaleString('id-ID')}
                </p>
            </div>

            <button
                onClick={() =>
                    navigate('/checkout', {
                    state: {
                        courtId: id,
                        courtName: court.name,
                        courtLocation: court.location,
                        selectedDate: selectedDate,
                        selectedSlots: selectedSlots,
                        totalPrice: totalPrice,
                    },
                    })
                }
                disabled={selectedSlots.length === 0}
                className={`px-6 sm:px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-all ${
                selectedSlots.length > 0
                    ? 'bg-[#ccff00] hover:bg-[#b3e600] text-black shadow-lg active:scale-95'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
            >
                Lanjut Booking
            </button>
            </div>
        </div>
        </div>
    );
}