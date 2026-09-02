import LogoImg from "../../assets/image/Logo.png"

export default function Footer() {
    return (
        <footer className="w-full bg-[#1A1A1A] py-6 px-8 md:px-20 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-800 relative">
            {/* Logo Section (Kiri) */}
            <div className="flex items-center">
                <img src={LogoImg} alt="Lapangan Main Logo" className="h-16 object-contain" />
            </div>

            {/* Copyright Text (Tengah / Melayang di Desktop) */}
            <div className="md:absolute md:left-1/2 md:-translate-x-1/2 text-center">
                <p className="text-[#CCFF00] font-bold text-base md:text-lg tracking-wide">
                    @2026 vanesben all right reserved
                </p>
            </div>

            {/* Spacer Kosong untuk Menjaga Keseimbangan Flex Layout di Desktop */}
            <div className="hidden md:block w-16"></div>
        </footer>
    )
}