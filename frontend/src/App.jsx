import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Layanan from './pages/Layanan';
import Order from './pages/Order';
import CekStatus from './pages/CekStatus';
import TentangKami from './pages/TentangKami';
import Kontak from './pages/Kontak';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/layanan" element={<Layanan />} />
              <Route path="/order" element={<Order />} />
              <Route path="/cek-status" element={<CekStatus />} />
              <Route path="/tentang" element={<TentangKami />} />
              <Route path="/kontak" element={<Kontak />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
