import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Feed from './pages/Feed'; // <-- 1. Import komponen Feed

function App() {
  return (
    <Router>
      <Routes>
        {/* 2. Rute utama sekarang langsung diarahkan ke halaman Feed */}
        <Route path="/" element={<Feed />} />
        
        {/* Rute lainnya tetap aman */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;