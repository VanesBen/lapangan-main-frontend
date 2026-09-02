import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

export default function Card({ id, photo, image, name, location, price, type}) {
  // Fallback image jika photo/image dari API tidak tersedia
  const defaultImage =
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop';

  return (
    <Link 
      to={`/katalog/${id}`} 
      className="bg-white text-[#0B4D26] rounded-sm overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
    >
      {/* Image Container */}
      <div className="w-full h-52 bg-gray-300 overflow-hidden">
        <img
          src={photo || image || defaultImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col justify-between flex-1 gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-extrabold text-[#0B4D26] group-hover:text-[#05381a] transition-colors">
            {name}
          </h3>
          
          {/* Icon Location Pin */}
          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0B4D26]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="truncate">{location || 'Lokasi tidak tersedia'}</span>
          </div>
        </div>

        <p className="text-sm text-[#0B4D26]">
          Mulai dari <span className="font-extrabold text-base">{price || 'Rp75.000'}</span> /jam
        </p>

        {type == "admin" ? <Button title={"Update"}/> : null}
      </div>
    </Link>
  );
}