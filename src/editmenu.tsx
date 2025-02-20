import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import axios from 'axios';

// Konfigurasi axios dengan URL ngrok
const api = axios.create({
  baseURL: 'https://d006-114-10-45-252.ngrok-free.app/menu',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  is_available: boolean;
}

const EditMenuPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Mendapatkan id dari URL
  const navigate = useNavigate();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchMenuItem();
    } else {
      setError('ID menu tidak ditemukan.');
      setLoading(false);
    }
  }, [id]);

  const fetchMenuItem = async () => {
    try {
      const response = await api.get(`/${id}`);
      setMenuItem(response.data);
    } catch (err) {
      setError('Gagal memuat menu. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!menuItem || !menuItem.name || !menuItem.price || !menuItem.description || !menuItem.image) {
      setError('Semua field harus diisi.');
      return;
    }
    try {
      await api.put(`/${id}`, menuItem);
      navigate('/menu'); 
    } catch (err) {
      setError('Gagal menyimpan perubahan. Silakan coba lagi.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 overflow-x-hidden">
      <div className="bg-white p-4 flex items-center space-x-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-full">
          <IoIosArrowBack className="text-2xl text-gray-700" />
        </button>
        <h1 className="text-lg font-medium">Edit Menu</h1>
      </div>

      <div className="p-4 space-y-3">
        {menuItem && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                value={menuItem.name}
                onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
                className="p-2 border rounded"
                placeholder="Nama Menu"
              />
              <input
                type="number"
                value={menuItem.price}
                onChange={(e) => setMenuItem({ ...menuItem, price: parseFloat(e.target.value) })}
                className="p-2 border rounded"
                placeholder="Harga"
              />
              <textarea
                value={menuItem.description}
                onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
                className="p-2 border rounded"
                placeholder="Deskripsi"
              />
              <input
                type="text"
                value={menuItem.image}
                onChange={(e) => setMenuItem({ ...menuItem, image: e.target.value })}
                className="p-2 border rounded"
                placeholder="URL Gambar"
              />
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Simpan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditMenuPage;
