import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import OfferDetail from './pages/OfferDetail';
import MyCoupons from './pages/MyCoupons';
import ProtectedRoute from './components/ProtectedRoute';
import RequireClienteProfile from './components/RequireClienteProfile';
import CompleteProfile from './pages/CompleteProfile';

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
                    <Route element={<ProtectedRoute />}>
                        <Route path="/completar-perfil" element={<CompleteProfile />} />
                    </Route>

                    <Route element={<ProtectedRoute />}>
                        <Route element={<RequireClienteProfile />}>
                            {/* Detalle de oferta */}
                            <Route path="/oferta/:id" element={<OfferDetail />} />

                            {/* Mis cupones */}
                            <Route path="/mis-cupones" element={<MyCoupons />} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
