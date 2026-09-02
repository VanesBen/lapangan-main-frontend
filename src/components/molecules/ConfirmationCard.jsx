import React from 'react';

export default function ConfirmationCard({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#252629] border border-gray-800 w-full max-w-sm rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        
        {/* Checkmark Icon */}
        <div className="w-16 h-16 bg-[#ccff00]/10 border border-[#ccff00] text-[#ccff00] rounded-full flex items-center justify-center mx-auto text-3xl font-black">
          ✓
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-xl font-black">Booking Berhasil!</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Pembayaran telah dikonfirmasi dan slot jadwal lapangan kamu sudah berhasil dipesan.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full bg-[#ccff00] hover:bg-[#b3e600] active:scale-95 text-black font-extrabold py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md"
        >
          Lihat Riwayat Booking
        </button>
      </div>
    </div>
  );
}