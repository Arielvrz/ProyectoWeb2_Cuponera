import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import OfferDetail from './pages/OfferDetail';
import MyCoupons from './pages/MyCoupons';
import CompleteProfile from './pages/CompleteProfile';

import ProtectedRoute from './components/ProtectedRoute';
import RequireClienteProfile from './components/RequireClienteProfile';
import RequireRole from './components/RequireRole';
import AdminLayout from './components/AdminLayout';
import CompanyLayout from './components/CompanyLayout';

import AdminDashboard from './pages/admin/Dashboard';
import Rubros from './pages/admin/Rubros';
import Empresas from './pages/admin/Empresas';
import EmpresaDetail from './pages/admin/EmpresaDetail';
import AprobacionOfertas from './pages/admin/AprobacionOfertas';
import Clientes from './pages/admin/Clientes';
import ClienteDetail from './pages/admin/ClienteDetail';

import CompanyOfertas from './pages/company/Ofertas';
import NuevaOferta from './pages/company/NuevaOferta';
import EditarOferta from './pages/company/EditarOferta';
import CompanyEmpleados from './pages/company/Empleados';

import CanjearCupon from './pages/empleado/CanjearCupon';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Cliente — profile completion */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/completar-perfil" element={<CompleteProfile />} />
                    </Route>

                    {/* Cliente — protected offer + coupon routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<RequireClienteProfile />}>
                            <Route path="/oferta/:id" element={<OfferDetail />} />
                            <Route path="/mis-cupones" element={<MyCoupons />} />
                        </Route>
                    </Route>

                    {/* Admin */}
                    <Route element={<RequireRole roles={['admin']} />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="rubros" element={<Rubros />} />
                            <Route path="empresas" element={<Empresas />} />
                            <Route path="empresas/:id" element={<EmpresaDetail />} />
                            <Route path="aprobacion" element={<AprobacionOfertas />} />
                            <Route path="clientes" element={<Clientes />} />
                            <Route path="clientes/:id" element={<ClienteDetail />} />
                        </Route>
                    </Route>

                    {/* Company Admin */}
                    <Route element={<RequireRole roles={['company_admin']} />}>
                        <Route path="/empresa" element={<CompanyLayout />}>
                            <Route path="ofertas" element={<CompanyOfertas />} />
                            <Route path="ofertas/nueva" element={<NuevaOferta />} />
                            <Route path="ofertas/:id/editar" element={<EditarOferta />} />
                            <Route path="empleados" element={<CompanyEmpleados />} />
                        </Route>
                    </Route>

                    {/* Employee */}
                    <Route element={<RequireRole roles={['employee']} />}>
                        <Route path="/empleado/canjear" element={<CanjearCupon />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
