import React from 'react';

export default function Dropdown({
  title,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Pilih Kategori',
  error,
}) {
  return (
    <div>
      {/* Label */}
      <div className="flex justify-between items-center mb-2">
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
          {title}
        </label>
      </div>

      {/* Select Box Container */}
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-[#13161b] border border-gray-800 rounded-2xl px-4 py-3.5 pr-10 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
        >
          {placeholder && (
            <option value="" disabled className="bg-[#13161b] text-gray-500">
              {placeholder}
            </option>
          )}

          {options.map((option) => {
            const val = typeof option === 'object' ? option.value : option;
            const label = typeof option === 'object' ? option.label : option;

            return (
              <option key={val} value={val} className="bg-[#13161b] text-white">
                {label}
              </option>
            );
          })}
        </select>

        {/* Custom Arrow Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}