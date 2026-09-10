import HeroImg from "../assets/image/Hero.png"
import Button from "../components/atomic/Button"
import featureIC1 from "../assets/icon/feature-ic-1.png"
import featureIC2 from "../assets/icon/feature-ic-2.png"
import featureIC3 from "../assets/icon/feature-ic-3.png"
import { useNavigate } from "react-router-dom"
import Pagination from "../components/atomic/Pagination"

export default function Home() {
    const navigate = useNavigate();
    
    const features = [
        {
            icon: featureIC1,
            title: "Pemesanan Serba Otomatis & Real-Time",
            desc: "Ga ada lagi drama slot bentrok atau nunggu konfirmasi admin via WhatsApp. Jadwal lapangan ter-update secara otomatis detik itu juga saat kamu pilih jam main."
        },
        {
            icon: featureIC2,
            title: "Fleksibilitas Tarif Berdasarkan Jam & Hari",
            desc: "Dapatkan transparansi harga terbaik. Sistem pricing rule pintar menyesuaikan tarif secara adil—baik untuk slot weekday, malam hari, maupun weekend prime-time."
        },
        {
            icon: featureIC3,
            title: "Pembayaran Instan dengan Konfirmasi Otomatis",
            desc: "Transaksi aman dan serba praktis lewat integrasi Payment Gateway. Cukup scan QRIS atau transfer via Virtual Account, status pesananmu langsung terverifikasi tanpa perlu kirim bukti transfer."
        }
    ];

    const courts = [
        {
            id: 1,
            name: "Lapangan Singa 1",
            location: "Jakarta Utara",
            price: "Rp100.000",
            image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=600&auto=format&fit=crop" // Placeholder Gambar Lapangan
        },
        {
            id: 2,
            name: "Lapangan Singa 1",
            location: "Jakarta Utara",
            price: "Rp100.000",
            image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=600&auto=format&fit=crop"
        },
        {
            id: 3,
            name: "Lapangan Singa 1",
            location: "Jakarta Utara",
            price: "Rp100.000",
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop"
        }
    ];

    return (
        <>
        <Pagination/>
            <section id="Hero" className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
                {/* Background Image dengan Dark Overlay */}
                <img 
                    className="w-full h-full object-cover object-center filter brightness-[0.4]" 
                    src={HeroImg} 
                    alt="Hero Background" 
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 md:px-12 gap-4">
                    <h1 className="text-4xl md:text-6xl font-black text-[#CCFF00] tracking-wider uppercase max-w-5xl leading-tight">
                        SAATNYA TURUN KE LAPANGAN
                    </h1>
                    
                    <p className="text-white text-lg md:text-2xl font-semibold max-w-2xl leading-relaxed drop-shadow-md">
                        Cari lokasi terdekat, kunci slot waktumu, dan siap main tanpa ribet.
                    </p>

                    <div className="mt-2">
                        <Button onClick={() =>{navigate("/katalog")}} title={"CARI LAPANGAN"} />
                    </div>
                </div>
            </section>

            <section id="AboutUs" className="w-full bg-[#1A1A1A] text-white py-16 md:py-24 px-8 md:px-20 flex flex-col justify-center items-start gap-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#CCFF00] leading-tight max-w-4xl tracking-tight">
                    Main Jadi Lebih Praktis,<br className="hidden sm:inline" /> Kelola Lapangan Lebih Efisien
                </h2>

                <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed max-w-5xl font-normal">
                    LapanganMain menghubungkan pemain dengan pengelola venue secara real-time. Penyewa bisa amankan slot jam dan bayar instan tanpa takut jadwal bentrok, sementara pengelola dapat mengelola pesanan, mengatur tarif fleksibel, dan memantau pendapatan otomatis tanpa ribet rekap manual.
                </p>
            </section>

            
            <section id="Features" className="w-full bg-white text-gray-900 py-16 md:py-24 px-8 md:px-20 flex flex-col items-center gap-12">
                {/* Main Title */}
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B4D26] underline underline-offset-8 decoration-4">
                    Keunggulan Kami
                </h2>

                {/* Cards Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
                    {features.map((item, index) => (
                        <div 
                            key={index} 
                            className="border-2 border-[#0B4D26] p-8 flex flex-col items-start gap-4 text-left bg-white"
                        >
                            {/* Icon Container */}
                            <div className="mb-2">
                                <img src={item.icon} alt="" />
                            </div>

                            {/* Card Title */}
                            <h3 className="text-xl font-extrabold text-[#0B4D26] underline underline-offset-4 leading-snug">
                                {item.title}
                            </h3>

                            {/* Card Description */}
                            <p className="text-base text-[#0B4D26] leading-relaxed underline underline-offset-2">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section id="FeatureProduct" className="w-full bg-[#1A1A1A] text-white py-16 md:py-24 px-8 md:px-20 flex flex-col justify-center items-start gap-10">
            {/* Header Section */}
            <div className="w-full flex justify-between items-center">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#CCFF00] tracking-tight">
                    Lapangan Pilihan
                </h2>

                <a 
                    href="/katalog" 
                    className="flex items-center gap-2 text-[#CCFF00] font-bold text-lg hover:underline underline-offset-4 transition-all"
                >
                    Pelajari lebih lanjut <span className="text-xl">&rarr;</span>
                </a>
            </div>

            {/* Cards Grid / Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {courts.map((court) => (
                    <div 
                        key={court.id} 
                        className="bg-white text-[#0B4D26] rounded-sm overflow-hidden flex flex-col justify-between shadow-lg"
                    >
                        {/* Image Container */}
                        <div className="w-full h-52 bg-gray-300">
                            <img 
                                src={court.image} 
                                alt={court.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Card Body */}
                        <div className="p-6 flex flex-col justify-between flex-1 gap-6">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-xl font-extrabold text-[#0B4D26]">
                                    {court.name}
                                </h3>
                                {/* Pure Inline SVG untuk Icon Location Pin */}
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0B4D26]">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 24 24" 
                                        fill="currentColor" 
                                        className="w-4 h-4"
                                    >
                                        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                    </svg>
                                    <span>{court.location}</span>
                                </div>
                            </div>

                            <p className="text-sm text-[#0B4D26]">
                                Mulai dari <span className="font-extrabold text-base">{court.price}</span> /jam
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
        </section>
        
        </>
    )
}