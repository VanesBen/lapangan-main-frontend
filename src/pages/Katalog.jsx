import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/atomic/Card';
import axiosClient from '../axios-client';
import { useAuth } from '../contexts/AuthContext';

export default function Katalog() {
  const navigate = useNavigate();
  const { setIsLoading, isLoading } = useAuth();

  const [courts, setCourts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert] = useState(null);


  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const loadCourts = (page = 1) => {
  setIsLoading(true);
  axiosClient
    .get(`/courts?page=${page}`)
    .then(({ data }) => {
      // Ambil array dari data.items
      const courtList = data.data?.items || [];
      setCourts(courtList);

      // Set metadata pagination jika ada
      if (data.data?.meta) {
        setCurrentPage(data.data.meta.current_page);
        setTotalPage(data.data.meta.last_page);
      }
    })
    .catch((err) => {
      console.error(err);
      setCourts([]);
    })
    .finally(() => {
      setIsLoading(false);
    });
};

  useEffect(() => {
    loadCourts();
  }, []);

  const filteredCourts = courts.filter((court) => {
    const nameMatch = court.name
      ? court.name.toLowerCase().includes(searchQuery.toLowerCase())
      : false;
    const locationMatch = court.location
      ? court.location.toLowerCase().includes(searchQuery.toLowerCase())
      : false;
    return nameMatch || locationMatch;
  });

  return (
    <div className="min-h-screen bg-[#1c1d1f] text-white flex flex-col font-sans">
      {/* 1. ALERT NOTIFICATION */}
      {alert && (
        <div
          className={`p-4 text-center font-bold text-sm ${
            alert.type === 'error' ? 'bg-red-600' : 'bg-green-600'
          } text-white`}
        >
          {alert.message}
        </div>
      )}

      {/* 2. HERO SECTION WITH FLOATING SEARCH BAR */}
      <div className="relative">
        <div className="bg-[#05381a] h-44 md:h-52 w-full"></div>

        <div className="max-w-4xl mx-auto px-4 -mt-7 md:-mt-8 relative z-10">
          <div className="relative flex items-center shadow-2xl rounded-sm overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 px-4 md:px-6 bg-[#d9d9d9] flex items-center justify-center text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 md:w-8 md:h-8"
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
              className="w-full bg-[#d9d9d9] text-black placeholder-gray-600 font-bold text-lg md:text-2xl py-3.5 md:py-4 pl-16 md:pl-24 pr-6 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. CATALOG GRID CONTENT SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex-1 w-full">
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg font-semibold animate-pulse">
              Memuat data lapangan...
            </p>
          </div>
        ) : filteredCourts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg font-semibold">
              Lapangan yang kamu cari tidak ditemukan.
            </p>
            <p className="text-sm">
              Coba ketik kata kunci lain (nama lapangan atau kota).
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {filteredCourts.map((court) => (
              <Card
                key={court.id}
                id={court.id}
                location={court.location}
                name={court.name}
                photo={court.photo}
                description={court.description}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}