import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Switch } from "@headlessui/react";
import axios from "axios";

// Konfigurasi axios dengan URL ngrok
const api = axios.create({
  baseURL: "https://d006-114-10-45-252.ngrok-free.app/menu",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  },
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
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const seller_id = localStorage.getItem("seller_id");
    if (!seller_id) {
      setError("Seller ID tidak ditemukan. Silakan login kembali.");
      setLoading(false);
      return;
    }
    try {
      const response = await api.get(`/${seller_id}`);
      if (Array.isArray(response.data)) {
        setMenuItems(response.data);
      } else {
        setError("Data menu tidak valid");
      }
    } catch (err) {
      setError("Gagal memuat menu. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/${id}`, { is_available: !currentStatus });
      // Setelah status berhasil diubah, ambil ulang data menu untuk memastikan data ter-update
      fetchMenuItems();
    } catch (err) {
      setError("Gagal mengubah status menu");
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      try {
        await api.delete(`/${id}`);
        setMenuItems((items) => items.filter((item) => item.id !== id));
      } catch (err) {
        setError("Gagal menghapus menu");
      }
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
        <h1 className="text-lg font-medium">Menu</h1>
      </div>

      <div className="p-4 space-y-3">
        {menuItems.map((item) => (
          <div key={item.id || Math.random().toString(36)} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">Rp {item.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col space-y-2">
                      {/* Ubah tombol Edit untuk navigasi ke halaman edit */}
                      <button
                        className="text-xs text-blue-600 px-3 py-1 border rounded-lg"
                        onClick={() => navigate(`/editmenu/${item.id}`)} // Arahkan ke halaman edit
                      >
                        Edit
                      </button>
                      <button className="text-xs text-red-600 px-3 py-1 border rounded-lg" onClick={() => handleDeleteMenu(item.id)}>
                        Hapus
                      </button>
                    </div>
                    <Switch
                      checked={item.is_available}
                      onChange={() => handleToggleAvailability(item.id, item.is_available)}
                      className={`${item.is_available ? "bg-[#4CD964]" : "bg-gray-200"} relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                      <span className={`${item.is_available ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white`} />
                    </Switch>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
