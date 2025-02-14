import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@headlessui/react';
import burgerImg from './assets/burger.jpg';

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const [isEnabled, setIsEnabled] = React.useState(true);

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
        {/* Menu Item Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-4">
            {/* Image */}
            <div className="w-16 h-16 bg-gray-200 rounded-xl shadow-sm overflow-hidden flex-shrink-0">
              <img 
                src={burgerImg} 
                alt="Burger Burgar" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-800">Burger Burgar</h3>
                  <p className="text-sm text-gray-500">Rp 20.000.000</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    Burger dengan daging sapi premium 200gr, keju mozarella, selada segar, tomat, dan saus spesial
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* Edit & Delete Buttons */}
                  <div className="flex flex-col space-y-2">
                    <button 
                      className="text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium px-3 py-1 border border-blue-600 rounded-lg hover:bg-blue-50"
                      onClick={() => navigate('/setupmenu')}
                    >
                      Edit
                    </button>
                    
                    <button 
                      className="text-xs text-red-600 hover:text-red-700 transition-colors font-medium px-3 py-1 border border-red-600 rounded-lg hover:bg-red-50"
                      onClick={() => {
                        if(window.confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
                          // Proses hapus menu
                        }
                      }}
                    >
                      Hapus
                    </button>
                  </div>

                  {/* Toggle Switch */}
                  <Switch
                    checked={isEnabled}
                    onChange={setIsEnabled}
                    className={`${
                      isEnabled ? 'bg-[#4CD964]' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shadow-sm`}
                  >
                    <span
                      className={`${
                        isEnabled ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm`}
                    />
                  </Switch>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
