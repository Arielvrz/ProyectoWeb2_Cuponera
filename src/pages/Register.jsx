import { useState } from 'react';

const Register = () => {
    const [formData, setFormData] = useState({
        nombres: '', apellidos: '', telefono: '', correo: '', direccion: '', dui: '', password: ''
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};
        const duiRegex = /^\d{8}-\d{1}$/;
        const phoneRegex = /^[267]\d{7}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if (!duiRegex.test(formData.dui)) tempErrors.dui = "DUI inválido (ej. 12345678-9)";
        if (!phoneRegex.test(formData.telefono)) tempErrors.telefono = "Debe iniciar con 2, 6 o 7 y tener 8 dígitos";
        if (!emailRegex.test(formData.correo)) tempErrors.correo = "Correo inválido";
        if (!passwordRegex.test(formData.password)) tempErrors.password = "Mínimo 8 caracteres, 1 mayúscula y 1 número";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // NUEVA FUNCIÓN: Formatea el DUI automáticamente
    const handleDuiChange = (e) => {
        // 1. Eliminamos cualquier carácter que no sea un número
        let value = e.target.value.replace(/\D/g, "");

        // 2. Limitamos a un máximo de 9 números
        if (value.length > 9) {
            value = value.slice(0, 9);
        }

        // 3. Agregamos el guion automáticamente después del octavo dígito
        if (value.length > 8) {
            value = `${value.slice(0, 8)}-${value.slice(8)}`;
        }

        // 4. Actualizamos el estado
        setFormData({ ...formData, dui: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log("Datos válidos listos para enviar:", formData);
            // Aquí enviarás los datos a tu base de datos
        }
    };

    return (
        <div className="min-h-screen bg-darkBg flex justify-center items-center p-4 font-serif">
            <form onSubmit={handleSubmit} className="bg-darkCard p-8 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] w-full max-w-md text-textMain border border-gray-800">
                <h2 className="text-3xl font-bold mb-6 text-center text-white tracking-wide">Únete a <span className="text-accentRed">La Cuponera</span></h2>

                {/* INPUT DE DUI ACTUALIZADO */}
                <div className="mb-4">
                    <label className="block text-sm mb-2 text-textMuted font-medium">Número de DUI</label>
                    <input
                        type="text"
                        value={formData.dui} // Controlamos el valor desde el estado
                        maxLength="10"       // Límite físico en el HTML (8 números + 1 guion + 1 número)
                        className="w-full p-3 bg-darkSurface border border-gray-700 rounded-sm focus:border-accentRed focus:ring-1 focus:ring-accentRed focus:outline-none transition"
                        placeholder="00000000-0"
                        onChange={handleDuiChange} // Usamos nuestra nueva función
                    />
                    {errors.dui && <p className="text-accentRed text-xs mt-1 font-medium">{errors.dui}</p>}
                </div>

                {/* Aquí irían el resto de tus inputs (nombres, apellidos, teléfono, correo, etc.) */}

                <button type="submit" className="w-full mt-6 bg-accentRed text-white p-3 rounded-sm font-bold hover:bg-red-700 transition duration-300 shadow-[0_0_15px_rgba(230,57,70,0.3)] tracking-wider uppercase text-sm">
                    Crear Cuenta
                </button>
            </form>
        </div>
    );
};

export default Register;