import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import OfferDetail from './pages/OfferDetail';
import MyCoupons from './pages/MyCoupons';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Ruta principal */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Autenticación */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Detalle de oferta */}
                    <Route path="/oferta/:id" element={<OfferDetail />} />

                    {/* Mis cupones */}
                    <Route path="/mis-cupones" element={<MyCoupons />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;