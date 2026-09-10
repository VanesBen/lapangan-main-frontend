import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

export default function Card({ id, photo, image, name, location, price, type, category}) {
    const resolveImageSrc = (src, fallback) => {
    if (!src) return fallback;

    // Sudah berupa URL HTTP atau Base64 lengkap dengan header data:image
    if (src.startsWith('http') || src.startsWith('data:image')) {
      return src;
    }

    // Jika di DB tersimpan raw base64 tanpa header Data URI
    return `data:image/jpeg;base64,${src}`;
  };

  const defaultImage =
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop';


  return (
    <Link 
      to={ type == "admin" ? `/admin/courts/${id}` : `/katalog/${id}`} 
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

          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0B4D26]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A4.494 4.494 0 0110.5 15.5v1.5H8.25a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H13.5v-1.5a4.494 4.494 0 01.108-3.632 6.73 6.73 0 002.743-1.346 6.753 6.753 0 006.138-5.6.75.75 0 00-.584-.859 47.78 47.78 0 00-3.071-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.616c-.073.377-.118.76-.134 1.148a5.253 5.253 0 01-1.996-2.584c.69-.142 1.39-.267 2.13-.374zm13.668 0c.74.107 1.44.232 2.13.374a5.253 5.253 0 01-1.996 2.584 13.714 13.714 0 01-.134-1.148z"
                clipRule="evenodd"
              />
            </svg>
            <span className="truncate">{category || 'Kategori tidak tersedia'}</span>
          </div>
          
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
          Mulai dari  
          <span className="font-extrabold text-base">
              {Number(price) > 0 ? `Rp ${Number(price).toLocaleString('id-ID')}` : '-'}
          </span>{' '}
          /jam
        </p>

        {type == "admin" ? <Button title={"Update"}/> : null}
      </div>
    </Link>
  );
}