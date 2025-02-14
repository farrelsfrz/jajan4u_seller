import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { BsImage } from 'react-icons/bs';

const SetupMenuPage: React.FC = () => {
  const navigate = useNavigate();

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
      <div className="p-4 space-y-4 max-w-xl mx-auto overflow-y-auto scrollbar-hide">
        {/* Item Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Nama Menu *</label>
          <input 
            type="text" 
            placeholder="Masukkan nama menu"
            className="w-full p-3.5 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>

        {/* Image Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center space-y-2 hover:border-blue-500 transition-colors cursor-pointer">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <BsImage className="text-3xl text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">Upload foto menu (max 1MB)</p>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Deskripsi Menu</label>
          <textarea 
            placeholder="Masukkan deskripsi menu"
            className="w-full p-3.5 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm min-h-[120px]"
          />
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Harga Menu *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
            <input 
              type="text" 
              placeholder="Masukkan harga menu"
              className="w-full p-3.5 pl-10 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button className="w-full bg-[#4CD964] text-white py-3.5 rounded-xl font-medium mt-6 hover:bg-[#44c359] transition-colors shadow-sm">
          Simpan Menu
        </button>
      </div>
    </div>
  );
};

export default SetupMenuPage;
