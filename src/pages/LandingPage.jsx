import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);

    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRubro, setSelectedRubro] = useState('Todos');

    useEffect(() => {
        const fetchActivas = async () => {
            try {
                const response = await fetch('/api/ofertas/activas');

                if (!response.ok) {
                    throw new Error('Error al obtener las ofertas');
                }

                const data = await response.json();
                setOffers(data);
            } catch (error) {
                console.error("Error fetching offers:", error);
                setOffers([
                    { id: 1, title: "Cena Exclusiva para Dos", rubro: "Restaurantes", priceRegular: "$120.00", priceOffer: "$59.99", image: "https://images.unsplash.com/photo-1544025162-d76694265947", description: "Cena premium para dos personas.", companyName: "Restaurante La Esquina", companyCode: "RES123", useLimitDate: "2026-04-30" },
                    { id: 2, title: "Mantenimiento Premium", rubro: "Talleres", priceRegular: "$250.00", priceOffer: "$149.99", image: "https://images.unsplash.com/photo-1613214149922-f1809c99b414", description: "Incluye revisión general y cambio de aceite.", companyName: "MotorPro", companyCode: "TAL456", useLimitDate: "2026-05-15" }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchActivas();
    }, []);

    const rubrosUnicos = ['Todos', ...new Set(offers.map(offer => offer.rubro))];

    const filteredOffers = selectedRubro === 'Todos'
        ? offers
        : offers.filter(offer => offer.rubro === selectedRubro);

    return (
        <div className="min-h-screen bg-darkBg text-textMain font-serif">
            {/* Navbar (Se mantiene igual) */}
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

            {/* Hero Section (Se mantiene igual) */}
            <header
                className="relative flex flex-col items-center justify-center text-center py-40 px-4 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
            >
                <div className="absolute inset-0 bg-black/60 z-0"></div>
                <div className="relative z-10 flex flex-col items-center max-w-4xl">
                    <span className="text-accentRed font-semibold tracking-[0.2em] mb-4 text-sm uppercase drop-shadow-md">Experiencias Inolvidables</span>
                    <h2 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg text-white leading-tight">
                        El lujo de disfrutar más,<br /> pagando <span className="text-accentRed">menos.</span>
                    </h2>
                    <p className="text-textMain text-xl mb-10 max-w-2xl font-light drop-shadow-md">
                        Accede a descuentos exclusivos en los mejores restaurantes, spas y servicios premium de la ciudad.
                    </p>
                    <a href="#catalogo" className="bg-accentRed text-white px-10 py-4 rounded-sm text-lg font-bold hover:bg-red-700 transition duration-300 shadow-[0_0_25px_rgba(230,57,70,0.6)] border border-accentRed/50">
                        Explorar Ofertas
                    </a>
                </div>
            </header>

            {/* Sección de Catálogo de Promociones */}
            <section id="catalogo" className="py-20 px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h3 className="text-3xl font-bold mb-2">Ofertas Disponibles</h3>
                        <p className="text-textMuted">Nuestra selección premium aprobada para ti.</p>
                    </div>
                </div>

                {/* Filtros por Rubro */}
                <div className="flex flex-wrap gap-3 mb-10 border-b border-gray-800 pb-4">
                    {rubrosUnicos.map(rubro => (
                        <button
                            key={rubro}
                            onClick={() => setSelectedRubro(rubro)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
                                selectedRubro === rubro
                                    ? 'bg-accentRed text-white shadow-[0_0_10px_rgba(230,57,70,0.4)]'
                                    : 'bg-darkSurface text-textMuted hover:text-white hover:bg-gray-800'
                            }`}
                        >
                            {rubro}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-textMuted animate-pulse">Cargando las mejores ofertas...</p>
                    </div>
                ) : filteredOffers.length === 0 ? (
                    <div className="text-center py-20 bg-darkSurface rounded-sm">
                        <p className="text-xl text-textMuted">No hay ofertas disponibles en la categoría "{selectedRubro}" en este momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {filteredOffers.map((offer) => (
                            <div key={offer.id} className="bg-darkCard rounded-sm overflow-hidden shadow-lg group hover:shadow-accentRed/20 transition duration-300 cursor-pointer border border-gray-800 hover:border-accentRed/40 flex flex-col">
                                <div className="relative h-64 overflow-hidden">
                                    <img src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                    <div className="absolute top-4 left-4 bg-darkBg/90 backdrop-blur-sm px-3 py-1 text-xs uppercase tracking-wider text-textMain rounded-sm border border-gray-700/50 shadow-sm">
                                        {offer.rubro}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h4 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-accentRed transition">{offer.title}</h4>
                                    <div className="flex items-baseline gap-3 mt-auto pt-4">
                                        <span className="text-3xl font-extrabold text-white">{offer.priceOffer}</span>
                                        <span className="text-textMuted line-through text-sm font-medium">{offer.priceRegular}</span>
                                    </div>

                                    {/* ✅ CONEXIÓN: se pasa la oferta completa al detalle */}
                                    <Link
                                        to={`/oferta/${offer.id}`}
                                        state={{ offer }}
                                        className="w-full mt-6 border-2 border-accentRed text-accentRed py-2 rounded-sm font-bold hover:bg-accentRed hover:text-white transition duration-300 uppercase text-sm tracking-wider text-center inline-block"
                                    >
                                        Comprar Cupón
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default LandingPage;