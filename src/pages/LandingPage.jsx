import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Datos ficticios para ilustrar las promociones
const mockOffers = [
    {
        id: 1,
        title: "Cena Exclusiva para Dos",
        rubro: "Restaurantes",
        priceRegular: "$120.00",
        priceOffer: "$59.99",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 2,
        title: "Mantenimiento Premium VVIP",
        rubro: "Talleres",
        priceRegular: "$250.00",
        priceOffer: "$149.99",
        image: "https://images.unsplash.com/photo-1613214149922-f1809c99b414?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 3,
        title: "Día de Spa y Relajación Total",
        rubro: "Salones de Belleza",
        priceRegular: "$180.00",
        priceOffer: "$89.50",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    }
];

const LandingPage = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-darkBg text-textMain font-serif">
            {/* Navbar */}
            <nav className="bg-darkSurface p-4 flex justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] sticky top-0 z-50">
                <h1 className="text-2xl font-bold tracking-widest text-accentRed uppercase">La Cuponera</h1>
                <div>
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <span className="text-textMuted">Bienvenido, <strong className="text-textMain">{user.name}</strong></span>
                            <button onClick={logout} className="border border-accentRed text-accentRed px-5 py-2 rounded-sm hover:bg-accentRed hover:text-white transition duration-300">Salir</button>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="text-textMuted hover:text-accentRed transition duration-300 flex items-center px-2">
                                Ingresar
                            </Link>
                            <Link to="/register" className="bg-accentRed px-6 py-2 rounded-sm font-semibold hover:bg-red-700 transition duration-300 text-white shadow-lg shadow-accentRed/20">
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section con Imagen de Fondo Lujosa */}
            {/* Se añade la imagen de fondo y se ajusta el overlay para mayor contraste */}
            <header
                className="relative flex flex-col items-center justify-center text-center py-40 px-4 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
            >
                <div className="absolute inset-0 bg-black/60 z-0"></div> {/* Overlay más oscuro para mejor legibilidad */}
                <div className="relative z-10 flex flex-col items-center max-w-4xl">
                    <span className="text-accentRed font-semibold tracking-[0.2em] mb-4 text-sm uppercase drop-shadow-md">Experiencias Inolvidables</span>
                    <h2 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg text-white leading-tight">
                        El lujo de disfrutar más,<br /> pagando <span className="text-accentRed">menos.</span>
                    </h2>
                    <p className="text-textMain text-xl mb-10 max-w-2xl font-light drop-shadow-md">
                        Accede a descuentos exclusivos en los mejores restaurantes, spas y servicios premium de la ciudad.
                    </p>
                    <button className="bg-accentRed text-white px-10 py-4 rounded-sm text-lg font-bold hover:bg-red-700 transition duration-300 shadow-[0_0_25px_rgba(230,57,70,0.6)] border border-accentRed/50">
                        Explorar Ofertas
                    </button>
                </div>
            </header>

            {/* Sección de Promociones Destacadas */}
            <section className="py-20 px-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h3 className="text-3xl font-bold mb-2">Ofertas de la Semana</h3>
                        <p className="text-textMuted">Lo mejor de nuestra selección premium para ti.</p>
                    </div>
                    <button className="text-accentRed hover:text-white transition border-b border-accentRed pb-1 font-medium">Ver catálogo completo</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {mockOffers.map((offer) => (
                        <div key={offer.id} className="bg-darkCard rounded-sm overflow-hidden shadow-lg group hover:shadow-accentRed/20 transition duration-300 cursor-pointer border border-gray-800 hover:border-accentRed/40">
                            <div className="relative h-64 overflow-hidden">
                                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                <div className="absolute top-4 left-4 bg-darkBg/90 backdrop-blur-sm px-3 py-1 text-xs uppercase tracking-wider text-textMain rounded-sm border border-gray-700/50 shadow-sm">
                                    {offer.rubro}
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-accentRed transition">{offer.title}</h4>
                                <div className="flex items-baseline gap-3 mt-4">
                                    <span className="text-3xl font-extrabold text-white">{offer.priceOffer}</span>
                                    <span className="text-textMuted line-through text-sm font-medium">{offer.priceRegular}</span>
                                </div>
                                <button className="w-full mt-6 border-2 border-accentRed text-accentRed py-2 rounded-sm font-bold hover:bg-accentRed hover:text-white transition duration-300 uppercase text-sm tracking-wider">
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sección "Cómo Funciona" */}
            <section className="py-24 bg-darkSurface border-y border-gray-800/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-accentRed/5 z-0 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
                    <span className="text-accentRed font-semibold tracking-[0.2em] mb-2 block text-sm uppercase">Simple y Rápido</span>
                    <h3 className="text-3xl font-bold mb-16">¿Cómo funciona La Cuponera?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gray-800 -translate-y-1/2 z-0"></div>
                        <div className="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gray-800 -translate-y-1/2 z-0"></div>

                        <div className="relative z-10 bg-darkSurface p-6 rounded-sm">
                            <div className="w-20 h-20 bg-darkBg border-2 border-accentRed rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(230,57,70,0.3)]">
                                <span className="text-3xl text-accentRed font-extrabold">1</span>
                            </div>
                            <h4 className="text-xl font-bold mb-3">Compra tu Cupón</h4>
                            <p className="text-textMuted text-sm leading-relaxed px-4">Elige tu oferta favorita y realiza el pago de forma segura a través de nuestra plataforma.</p>
                        </div>
                        <div className="relative z-10 bg-darkSurface p-6 rounded-sm">
                            <div className="w-20 h-20 bg-darkBg border-2 border-accentRed rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(230,57,70,0.3)]">
                                <span className="text-3xl text-accentRed font-extrabold">2</span>
                            </div>
                            <h4 className="text-xl font-bold mb-3">Recibe tu Código</h4>
                            <p className="text-textMuted text-sm leading-relaxed px-4">Obtén un código único e intransferible al instante en tu perfil y correo electrónico.</p>
                        </div>
                        <div className="relative z-10 bg-darkSurface p-6 rounded-sm">
                            <div className="w-20 h-20 bg-darkBg border-2 border-accentRed rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(230,57,70,0.3)]">
                                <span className="text-3xl text-accentRed font-extrabold">3</span>
                            </div>
                            <h4 className="text-xl font-bold mb-3">Disfruta la Experiencia</h4>
                            <p className="text-textMuted text-sm leading-relaxed px-4">Presenta el cupón y tu DUI en el establecimiento para canjear tu descuento.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-darkBg py-16 px-8 border-t border-gray-900 text-center md:text-left">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold tracking-widest text-accentRed uppercase mb-6">La Cuponera</h2>
                        <p className="text-textMuted text-sm max-w-md leading-relaxed mb-6">
                            Somos la plataforma líder en El Salvador dedicada a conectar a los amantes del buen vivir con experiencias exclusivas a precios inigualables. Calidad, ahorro y estilo en un solo lugar.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Navegación</h4>
                        <ul className="text-textMuted text-sm space-y-3 font-medium">
                            <li><Link to="/" className="hover:text-accentRed transition duration-300 block py-1">Inicio</Link></li>
                            <li><a href="#" className="hover:text-accentRed transition duration-300 block py-1">Catálogo de Ofertas</a></li>
                            <li><a href="#" className="hover:text-accentRed transition duration-300 block py-1">¿Cómo funciona?</a></li>
                            <li><Link to="/login" className="hover:text-accentRed transition duration-300 block py-1">Ingresar / Registrarse</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Contacto & Legal</h4>
                        <ul className="text-textMuted text-sm space-y-3 font-medium">
                            <li><a href="#" className="hover:text-accentRed transition duration-300 block py-1">Términos y Condiciones</a></li>
                            <li><a href="#" className="hover:text-accentRed transition duration-300 block py-1">Política de Privacidad</a></li>
                            <li className="py-1 flex items-center gap-2"><span className="text-accentRed">✉️</span> soporte@lacuponera.com</li>
                            <li className="py-1 flex items-center gap-2"><span className="text-accentRed">📞</span> +503 2222-3333</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800/50 text-center text-textMuted text-xs font-medium flex flex-col md:flex-row justify-between items-center">
                    <p>© 2026 La Cuponera. Todos los derechos reservados.</p>
                    <p className="mt-2 md:mt-0">Proyecto de Cátedra - Desarrollo Web II</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;