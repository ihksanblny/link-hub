// src/components/UpdateProfileForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function UpdateProfileForm() {
  const { user, token } = useAuth();
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  // Ambil username saat ini untuk ditampilkan di form
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      // Kita gunakan user.id (UUID) untuk mengambil data awal
      const response = await fetch(`${apiUrl}/profile/${user.id}`); 
      const data = await response.json();
      if(response.ok) {
        setUsername(data.data.username);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${apiUrl}/profile/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();
    if(response.ok) {
      setMessage('Username berhasil diperbarui!');
    } else {
      setMessage(`Gagal: ${data.message}`);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-8">
      <h2 className="text-xl font-semibold mb-4">Pengaturan Profil</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username" className="block mb-2 text-sm font-medium">Username Publik</label>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">linkhub.com/</span>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-2.5"
          />
          <button type="submit" className="px-4 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg font-semibold">
            Simpan
          </button>
        </div>
        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}