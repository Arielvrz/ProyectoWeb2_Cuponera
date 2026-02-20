# 🗺️ Roadmap: Proyecto "La Cuponera" - Fase 1

[cite_start]Este documento define el flujo de trabajo paso a paso para construir la Fase 1 de la aplicación web "La Cuponera"[cite: 13, 14, 72]. [cite_start]El objetivo es construir la tienda de cupones usando React JS, conectada a un Backend as a Service (BaaS) como Firebase o Supabase[cite: 73, 74].

## 📌 Etapa 1: Configuración Inicial del Proyecto
[cite_start]**Objetivo:** Tener el entorno listo y estructurado cumpliendo con las buenas prácticas.
- [ ] [cite_start]Inicializar proyecto con Vite + React JS[cite: 73].
- [ ] Instalar React Router DOM para la navegación.
- [ ] [cite_start]Instalar y configurar un framework de CSS (Tailwind CSS o Bootstrap) para garantizar la calidad de las interfaces (20% de la nota)[cite: 9, 80].
- [ ] Crear estructura de carpetas (`components`, `pages`, `services`, `context`, `utils`).

## 🗄️ Etapa 2: Diseño de Base de Datos (Firebase / Supabase)
[cite_start]**Objetivo:** Crear las colecciones/tablas necesarias para la Fase 1[cite: 74].
- [ ] [cite_start]**Tabla `Clientes`**: Nombres, apellidos, teléfono, correo, dirección, número de DUI[cite: 56].
- [ ] [cite_start]**Tabla `Ofertas`**: Título, precio regular, precio oferta, fechas (inicio, fin, límite de uso), cantidad límite, descripción, estado ("Oferta aprobada"), y empresa asociada[cite: 17, 18, 19, 20, 21, 22, 23, 25, 27, 29].
- [ ] [cite_start]**Tabla `Rubros`**: Para clasificar las ofertas (restaurantes, talleres, etc.)[cite: 46, 76].
- [ ] [cite_start]**Tabla `Cupones`**: Código único, estado (disponible, canjeado, vencido), ID de oferta, ID de cliente[cite: 34, 63].

## 🔐 Etapa 3: Autenticación y Registro de Clientes
[cite_start]**Objetivo:** Permitir el registro y login, validando correctamente los datos de entrada (15% de la nota)[cite: 77, 80].
- [ ] [cite_start]Crear componente de formulario de registro público[cite: 55].
- [ ] [cite_start]Implementar inputs para: nombres, apellidos, teléfono, correo, dirección, número de DUI y contraseña[cite: 56].
- [ ] [cite_start]Agregar validaciones (ej. formato de DUI, correos válidos, contraseñas seguras).
- [ ] [cite_start]Implementar inicio de sesión con correo y contraseña[cite: 57].
- [ ] Manejar el estado del usuario logueado usando React Context.

## 🛍️ Etapa 4: Catálogo Público de Ofertas
[cite_start]**Objetivo:** Mostrar las promociones a los clientes[cite: 76].
- [ ] Crear la página principal (Home).
- [ ] [cite_start]Consultar a la base de datos las ofertas que estén en estado "Oferta aprobada" y dentro del rango de fechas activo[cite: 29, 32].
- [ ] [cite_start]Crear filtros o secciones para clasificar las ofertas por rubro[cite: 76].
- [ ] Crear tarjetas (cards) atractivas para cada oferta.

## 💳 Etapa 5: Proceso de Compra y Generación de Cupones
[cite_start]**Objetivo:** Simular la transacción y crear el cupón único[cite: 60, 78].
- [ ] Crear vista de detalle de la oferta.
- [ ] [cite_start]Implementar formulario simulado de pago con tarjeta de crédito[cite: 61].
- [ ] [cite_start]**Lógica de generación del código:** Crear función que concatene el código de la empresa (3 letras y 3 dígitos) con un número aleatorio de 7 dígitos[cite: 43, 62].
- [ ] [cite_start]Guardar el nuevo cupón en la base de datos asociado al cliente[cite: 34].

## 👤 Etapa 6: Perfil del Cliente
[cite_start]**Objetivo:** Que el cliente gestione sus cupones adquiridos[cite: 78].
- [ ] Crear vista "Mis Cupones".
- [ ] Consultar y mostrar los cupones del usuario logueado.
- [ ] [cite_start]Categorizar visualmente los cupones en: disponibles, canjeados y vencidos[cite: 63].

## 🚀 Etapa 7: Revisión Final y Despliegue
[cite_start]**Objetivo:** Subir el proyecto a internet y asegurar la rúbrica[cite: 5, 80].
- [ ] [cite_start]Revisar seguridad de accesos y roles (10% de la nota) para asegurar que solo clientes registrados compren.
- [ ] [cite_start]Hacer pruebas de funcionamiento general (40% de la nota).
- [ ] [cite_start]Desplegar la aplicación de React en un web hosting (ej. Vercel, Netlify o Firebase Hosting) (5% de la nota)[cite: 5, 80].

## 🏢 Etapa 8: Módulo del Administrador (La Cuponera)
[cite_start]**Objetivo:** Crear el back-office para el personal interno de la aplicación[cite: 40, 41, 73].
- [ ] [cite_start]**Gestión de Empresas:** CRUD (Crear, Leer, Actualizar, Eliminar) de empresas ofertantes[cite: 42].
- [ ] [cite_start]Asignar a cada empresa: nombre, código (3 letras y 3 dígitos), dirección, contacto, teléfono, correo, rubro y porcentaje de comisión[cite: 43].
- [ ] [cite_start]**Gestión de Rubros:** CRUD de categorías como restaurantes, talleres, etc[cite: 46].
- [ ] [cite_start]**Aprobación de Ofertas:** Revisar ofertas en estado "En espera de aprobación" para pasarlas a "Oferta aprobada" o "Oferta rechazada" (con justificación)[cite: 27, 28, 29, 30].
- [ ] [cite_start]**Estadísticas Globales:** Visualizar ventas, ingresos totales y el cálculo de la comisión cobrada a las empresas[cite: 37, 45].
- [ ] [cite_start]**Gestión de Clientes:** Ver datos de clientes y sus cupones (disponibles, canjeados, vencidos)[cite: 47, 48].

## 🏪 Etapa 9: Módulo del Administrador de Empresa Ofertante
[cite_start]**Objetivo:** Interfaz para que las empresas gestionen sus promociones y personal[cite: 49].
- [ ] [cite_start]Inicio de sesión con el correo de la empresa[cite: 50].
- [ ] [cite_start]**Gestión de Ofertas:** Formulario para ingresar título, precios, fechas de inicio/fin, fecha límite de uso, y cantidad límite (opcional) [cite: 16-25].
- [ ] [cite_start]Visualizar el estado de sus ofertas (activas, rechazadas, pasadas, etc.) y estadísticas de ventas e ingresos[cite: 51, 52].
- [ ] [cite_start]**Gestión de Empleados:** CRUD para registrar a los empleados que canjearán los cupones (nombres, apellidos, correo)[cite: 53].

## 📱 Etapa 10: Módulo del Empleado (Canje de Cupones)
[cite_start]**Objetivo:** Interfaz en el establecimiento físico para validar compras[cite: 35, 66].
- [ ] [cite_start]Buscador para ingresar el código del cupón[cite: 67].
- [ ] [cite_start]Validar que el cupón existe, no ha sido canjeado y que el DUI coincide[cite: 68].
- [ ] [cite_start]Cambiar el estado del cupón a "cupón canjeado"[cite: 68].

## ⚙️ Etapa 11: Funcionalidades Globales y Finales
**Objetivo:** Detalles técnicos exigidos para todos los usuarios.
- [ ] [cite_start]Generación de archivo PDF para los cupones disponibles del cliente[cite: 65].
- [ ] [cite_start]Interfaz para modificar la contraseña desde la cuenta (todos los roles)[cite: 70].
- [ ] [cite_start]Mecanismo de recuperación de contraseña (todos los roles)[cite: 71].