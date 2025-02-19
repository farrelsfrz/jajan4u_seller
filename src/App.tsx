// app.tsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from './loginpage';
import HomePage from './homepage';
import KeuanganPage from './keuangan';
import SetupMenuPage from './setupmenu';
import MenuPage from './menu';
import PesananPage from './pesanan';
import AnalisisPage from './analisis';
import EditMenuPage from './editmenu'; // import EditMenuPage

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/keuangan" element={<KeuanganPage />} />
      <Route path="/setupmenu" element={<SetupMenuPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/pesanan" element={<PesananPage />} />
      <Route path="/analisis" element={<AnalisisPage />} />
      <Route path="/editmenu/:id" element={<EditMenuPage />} /> {/* Tambahkan rute untuk editmenu */}
    </Routes>
  );
}

export default App;
