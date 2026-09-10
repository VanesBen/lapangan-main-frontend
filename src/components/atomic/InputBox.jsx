// src/components/InputBox.jsx
import { useBase64 } from "../../hooks/useBase64";

export default function InputBox({
  title,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  maxSizeMb = 2,
}) {
  const isFile = type === 'file';
  const { convertToBase64, loading, error } = useBase64({ maxSizeMb });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await convertToBase64(file);
      onChange({
        target: {
          name,
          value: base64,
        },
      });
    } catch {
      e.target.value = '';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
          {title}
        </label>
        {loading && <span className="text-xs text-blue-400 animate-pulse">Mengonversi...</span>}
      </div>

      <input
        type={type}
        name={name}
        {...(!isFile && { value })}
        onChange={isFile ? handleFileChange : onChange}
        placeholder={placeholder}
        className="w-full bg-[#13161b] border border-gray-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
      />

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}