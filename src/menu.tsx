import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@headlessui/react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://93d2-114-10-147-236.ngrok-free.app/menu',
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

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const seller_id = localStorage.getItem("seller_id");
    console.log("Seller ID:", seller_id);

    if (!seller_id) {
      setError("Seller ID tidak ditemukan. Silakan login kembali.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/${seller_id}`);
      
      if (response.data) {
        setMenuItems(response.data);
      }
    } catch (error) {
      setError('Gagal memuat menu');
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/menu/${id}`, {
        is_available: !currentStatus
      });
      
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, is_available: !currentStatus } : item
        )
      );
    } catch (error) {
      setError('Gagal mengubah status menu');
      console.error('Error toggling availability:', error);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      try {
        await api.delete(`/menu/${id}`);
        setMenuItems(prevItems => prevItems.filter(item => item.id !== id));
      } catch (error) {
        setError('Gagal menghapus menu');
        console.error('Error deleting menu:', error);
      }
    }
  };

  const handleEditMenu = (menuItem: MenuItem) => {
    console.log("Selected Menu Item:", menuItem); // Tambahkan log untuk memeriksa isi menuItem
    setSelectedMenuItem({
      ...menuItem,
      description: menuItem.description || "",
    });
    setShowEditPopup(true);
  };
  

  const handleUpdateMenu = async (updatedItem: MenuItem) => {
    if (!updatedItem.name || !updatedItem.description || isNaN(updatedItem.price) || updatedItem.price <= 0) {
      setError("Semua kolom harus diisi dengan benar, terutama harga yang harus berupa angka.");
      return;
    }
  
    if (!updatedItem.id) {
      setError("ID menu tidak ditemukan.");
      return;
    }
  
    try {
      const { id, name, price, description } = updatedItem;
      // Pastikan URL menggunakan `id` yang benar
      const response = await api.put(`/${id}`, { name, price, description });
  
      setMenuItems(items => 
        items.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      );
      setShowEditPopup(false);
    } catch (error) {
      setError('Gagal memperbarui menu');
      console.error('Error updating menu:', error);
    }
  };  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
        <h1 className="text-lg font-medium">Menu</h1>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-3">
        {menuItems.map((item, index) => (
          <div key={item.id || index} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-xl shadow-sm overflow-hidden flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">Rp {item.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col space-y-2">
                      <button 
                        className="text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium px-3 py-1 border border-blue-600 rounded-lg hover:bg-blue-50"
                        onClick={() => handleEditMenu(item)}
                      >
                        Edit
                      </button>
                      
                      <button 
                        className="text-xs text-red-600 hover:text-red-700 transition-colors font-medium px-3 py-1 border border-red-600 rounded-lg hover:bg-red-50"
                        onClick={() => handleDeleteMenu(item.id)}
                      >
                        Hapus
                      </button>
                    </div>

                    <Switch
                      checked={item.is_available}
                      onChange={() => handleToggleAvailability(item.id, item.is_available)}
                      className={`${
                        item.is_available ? 'bg-[#4CD964]' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shadow-sm`}
                    >
                      <span
                        className={`${
                          item.is_available ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm`}
                      />
                    </Switch>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showEditPopup && selectedMenuItem && (
        <EditMenuPopup 
          menuItem={selectedMenuItem} 
          onClose={() => setShowEditPopup(false)} 
          onSave={handleUpdateMenu} 
        />
      )}
    </div>
  );
};

interface EditMenuPopupProps {
  menuItem: MenuItem;
  onClose: () => void;
  onSave: (updatedItem: MenuItem) => void;
}

const EditMenuPopup: React.FC<EditMenuPopupProps> = ({ menuItem, onClose, onSave }) => {
  const [name, setName] = useState(menuItem.name || "");
  const [price, setPrice] = useState(menuItem.price || 0);
  const [description, setDescription] = useState(menuItem.description || "");
  const [image, setImage] = useState(menuItem.image || "");
  const [isAvailable, setIsAvailable] = useState(menuItem.is_available);

  const handleSave = () => {
    if (!name || !description || isNaN(price) || price <= 0) {
      alert("Semua kolom harus diisi dengan benar, terutama harga yang harus berupa angka.");
      return;
    }

    const updatedItem: MenuItem = {
      ...menuItem,
      name,
      price,
      description,
      image,
      is_available: isAvailable
    };

    onSave(updatedItem);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-lg font-medium mb-4">Edit Menu</h2>
        <div className="space-y-3">
          <input 
            type="text"
            placeholder="Nama Menu"
            className="w-full p-3 border rounded-lg"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          
          <input 
            type="number"
            placeholder="Harga"
            className="w-full p-3 border rounded-lg"
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
          />
          
          <textarea 
            placeholder="Deskripsi"
            className="w-full p-3 border rounded-lg"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <input 
            type="text"
            placeholder="URL Gambar"
            className="w-full p-3 border rounded-lg"
            value={image}
            onChange={e => setImage(e.target.value)}
          />

          <div className="flex items-center space-x-3">
            <label>Menu Tersedia</label>
            <Switch
              checked={isAvailable}
              onChange={setIsAvailable}
              className={`${
                isAvailable ? 'bg-[#4CD964]' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shadow-sm`}
            >
              <span
                className={`${
                  isAvailable ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm`}
              />
            </Switch>
          </div>

          <div className="flex space-x-3 mt-4">
            <button
              onClick={onClose}
              className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
