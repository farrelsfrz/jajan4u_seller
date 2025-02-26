import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { BsImage } from 'react-icons/bs';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://e1f9-103-151-226-8.ngrok-free.app',
  headers: {
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

interface MenuData {
  name: string;
  price: number;
  description: string;
  image: string;
  seller_id: string;
  filter_makan: string;
}

const SetupMenu: React.FC = () => {
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState<MenuData>({
    name: '',
    price: 0,
    description: '',
    image: '',
    seller_id: localStorage.getItem('seller_id') || '',
    filter_makan: '1'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMenuData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validasi data sebelum mengirim
    if (!menuData.name || !menuData.description || isNaN(menuData.price) || menuData.price <= 0) {
      setError("Semua kolom harus diisi dengan benar, terutama harga yang harus berupa angka.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/menu', menuData);
      
      if (response.status === 200 || response.status === 201) {
        alert('Menu berhasil ditambahkan!');
        navigate('/menu'); // Kembali ke halaman menu
      }
    } catch (err) {
      console.error('Error adding menu:', err);
      setError('Gagal menambahkan menu. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Preview image
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (menuData.image) {
      setImagePreview(menuData.image);
    } else {
      setImagePreview(null);
    }
  }, [menuData.image]);

  const handleFilterChange = (filter: string) => {
    setMenuData(prev => ({
      ...prev,
      filter_makan: filter
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 overflow-x-hidden scrollbar-hide">
      {/* Header */}
      <div className="bg-white p-4 flex items-center space-x-4 shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IoIosArrowBack className="text-2xl text-gray-700" />
        </button>
        <h1 className="text-lg font-medium">Add new item</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-xl mx-auto overflow-y-auto scrollbar-hide">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Kategori Menu *</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleFilterChange('1')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors ${
                menuData.filter_makan === '1'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Makanan
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('2')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors ${
                menuData.filter_makan === '2'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Minuman
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Nama Menu *</label>
          <input 
            type="text" 
            id="name"
            name="name"
            value={menuData.name}
            onChange={handleInputChange}
            placeholder="Masukkan nama menu"
            className="w-full p-3.5 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Harga Menu *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
            <input 
              type="number"
              id="price"
              name="price"
              value={menuData.price}
              onChange={handleInputChange}
              placeholder="Masukkan harga menu"
              className="w-full p-3.5 pl-10 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Deskripsi Menu</label>
          <textarea 
            id="description"
            name="description"
            value={menuData.description}
            onChange={handleInputChange}
            placeholder="Masukkan deskripsi menu"
            className="w-full p-3.5 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm min-h-[120px]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">URL Gambar</label>
          <input 
            type="text"
            id="image"
            name="image"
            value={menuData.image}
            onChange={handleInputChange}
            placeholder="Masukkan URL gambar"
            className="w-full p-3.5 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>

        {imagePreview && (
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}
        
        <div className="flex justify-between">
          <button 
            type="submit" 
            className="w-full bg-[#4CD964] text-white py-3.5 rounded-xl font-medium mt-6 hover:bg-[#44c359] transition-colors shadow-sm disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan Menu'}
          </button>
          <button 
            type="button" 
            className="w-full bg-[#dc3545] text-white py-3.5 rounded-xl font-medium mt-6 hover:bg-[#c82333] transition-colors shadow-sm disabled:opacity-50"
            onClick={() => navigate('/menu')}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetupMenu;