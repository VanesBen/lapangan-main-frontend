// src/hooks/useBase64.js
import { useState, useCallback } from 'react';

export function useBase64(options = {}) {
  const { maxSizeMb = 2, allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'] } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const convertToBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      setError(null);

      if (!file) {
        resolve(null);
        return;
      }

      // Validasi tipe file
      if (allowedTypes.length && !allowedTypes.includes(file.type)) {
        const err = `Tipe file tidak didukung (${file.type}).`;
        setError(err);
        return reject(new Error(err));
      }

      // Validasi ukuran file
      const maxBytes = maxSizeMb * 1024 * 1024;
      if (file.size > maxBytes) {
        const err = `Ukuran file melebihi batas maksimal ${maxSizeMb} MB.`;
        setError(err);
        return reject(new Error(err));
      }

      setLoading(true);

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        setLoading(false);
        resolve(reader.result);
      };

      reader.onerror = (err) => {
        setLoading(false);
        setError('Gagal membaca file.');
        reject(err);
      };
    });
  }, [maxSizeMb, allowedTypes]);

  return { convertToBase64, loading, error };
}