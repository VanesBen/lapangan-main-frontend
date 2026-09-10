export default function Pagination({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange 
}) {

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 my-8 text-sm">
      
      {/* 1. Tombol Previous */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3.5 py-2 rounded-xl border border-white/10 bg-[#2d2f36] text-white font-medium hover:bg-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        &larr; Prev
      </button>

      {/* 2. List Nomor Halaman */}
      <div className="flex items-center gap-1.5">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`h-9 w-9 rounded-xl font-bold transition-all ${
                isActive
                  ? "bg-[#CCFF00] text-black shadow-lg shadow-green-600/30 scale-105"
                  : "bg-[#2d2f36] text-gray-400 hover:bg-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* 3. Tombol Next */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3.5 py-2 rounded-xl border border-white/10 bg-[#2d2f36] text-white font-medium hover:bg-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Next &rarr;
      </button>

    </div>
  );
}