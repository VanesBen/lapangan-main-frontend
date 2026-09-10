import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/atomic/Card';
import axiosClient from '../axios-client';
import { useAuth } from '../contexts/AuthContext';
import Pagination from '../components/atomic/Pagination';

export default function Katalog() {
  const navigate = useNavigate();
  const { setIsLoading, isLoading } = useAuth();

  const [courts, setCourts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [alert, setAlert] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const isInitialMount = useRef(true);

  // Daftar kategori sesuai master data seeder
  const categories = [
    'Futsal / Sepakbola',
    'Badminton',
    'Basket',
    'Tenis',
    'Padel',
  ];

  const loadCourts = (page = 1, search = searchQuery, cat = category, sort = sortBy) => {
    setIsLoading(true);

    // Parsing opsi sorting
    let sortColumn = '';
    let sortDirection = '';

    if (sort === 'name_asc') {
      sortColumn = 'name';
      sortDirection = 'asc';
    } else if (sort === 'name_desc') {
      sortColumn = 'name';
      sortDirection = 'desc';
    } else if (sort === 'newest') {
      sortColumn = 'created_at';
      sortDirection = 'desc';
    } else if (sort === 'oldest') {
      sortColumn = 'created_at';
      sortDirection = 'asc';
    }

    const params = {
      page,
      ...(search.trim() && { search: search.trim() }),
      ...(cat && { category: cat }),
      ...(sortColumn && { sort_by: sortColumn, sort_direction: sortDirection }),
    };

    axiosClient
      .get('/courts', { params })
      .then(({ data }) => {
        const courtList = data.data?.items || data.data || [];
        setCourts(courtList);

        if (data.data?.meta) {
          setCurrentPage(data.data.meta.current_page);
          setTotalPage(data.data.meta.last_page);
        }
      })
      .catch((err) => {
        console.error('Gagal mengambil data lapangan:', err);
        setCourts([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Load awal saat komponen dimount
  useEffect(() => {
    loadCourts(1, '', '', '');
  }, []);

  // Debounce search query & trigger refetch saat filter atau sort berubah
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setCurrentPage(1);
      loadCourts(1, searchQuery, category, sortBy);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, category, sortBy]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadCourts(newPage, searchQuery, category, sortBy);
  };

  return (
    <div className="min-h-screen bg-[#1c1d1f] text-white flex flex-col font-sans">


      <div className="relative">
        <div className="bg-[#05381a] h-44 md:h-52 w-full"></div>

        <div className="max-w-5xl mx-auto px-4 -mt-7 md:-mt-8 relative z-10">
          <div className="flex flex-col md:flex-row items-stretch gap-3 shadow-2xl">
            {/* Search Bar Input */}
            <div className="relative flex-1 flex items-center rounded-sm overflow-hidden bg-[#d9d9d9]">
              <div className="absolute left-0 top-0 bottom-0 px-4 md:px-5 flex items-center justify-center text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 md:w-6 md:h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <input
                type="text"
                placeholder="Cari Lapangan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-black placeholder-gray-600 font-bold text-base md:text-lg py-3.5 pl-14 md:pl-16 pr-4 focus:outline-none"
              />
            </div>

            {/* Dropdown Filter Kategori */}
            <div className="w-full md:w-56 bg-[#d9d9d9] rounded-sm overflow-hidden flex items-center px-3 border-t md:border-t-0 md:border-l border-gray-300">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent text-black font-semibold text-sm md:text-base py-3.5 focus:outline-none cursor-pointer"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown Sort Options */}
            <div className="w-full md:w-52 bg-[#d9d9d9] rounded-sm overflow-hidden flex items-center px-3 border-t md:border-t-0 md:border-l border-gray-300">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-transparent text-black font-semibold text-sm md:text-base py-3.5 focus:outline-none cursor-pointer"
              >
                <option value="">Urutkan</option>
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="name_asc">Nama (A - Z)</option>
                <option value="name_desc">Nama (Z - A)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN CATALOG GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex-1 w-full">
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg font-semibold animate-pulse">
              Memuat data lapangan...
            </p>
          </div>
        ) : courts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg font-semibold">
              Lapangan yang kamu cari tidak ditemukan.
            </p>
            <p className="text-sm">
              Coba sesuaikan kata kunci atau ubah filter kategori.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {courts.map((court) => {
              const rules = court.prices || court.pricing_rules || court.pricingRules || [];

              const minPrice = rules.length > 0
                ? Math.min(...rules.map((rule) => Number(rule.price_per_hour)))
                : (court.price || 0);

              return (
                <Card
                  key={court.id}
                  id={court.id}
                  location={court.location}
                  name={court.name}
                  photo={court.photo}
                  description={court.description}
                  category={court.category}
                  price={minPrice}
                />
              );
            })}
          </div>
        )}

        <div className="mt-8">
          <Pagination
            totalPages={totalPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </div>
  );
}