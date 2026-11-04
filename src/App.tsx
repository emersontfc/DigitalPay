import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/public/HomePage';
import { SalesPage } from './pages/public/SalesPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página inicial / vitrine */}
        <Route path="/" element={<HomePage />} />

        {/* Painel Administrativo */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Páginas de vendas públicas com URLs amigáveis */}
        <Route path="/p/:slug" element={<SalesPage />} />

        {/* Redirecionamentos de conveniência */}
        <Route path="/painel" element={<Navigate to="/admin" replace />} />
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
