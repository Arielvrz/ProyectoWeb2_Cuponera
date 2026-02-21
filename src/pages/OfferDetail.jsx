import { useContext, useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { comprarCupon, fetchOfertaVigenteById } from "../lib/supabaseApi"

function onlyDigits(v) {
  return String(v || "").replace(/\D/g, "")
}

function isValidCardNumber(v) {
  const s = onlyDigits(v)
  if (s.length < 13 || s.length > 19) return false
  let sum = 0
  let alt = false
  for (let i = s.length - 1; i >= 0; i--) {
    let n = parseInt(s[i], 10)
    if (alt) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alt = !alt
  }
  return sum % 10 === 0
}

function isValidExpiry(mmYY) {
  const m = String(mmYY || "").trim()
  if (!/^\d{2}\/\d{2}$/.test(m)) return false
  const [mm, yy] = m.split("/").map(Number)
  if (mm < 1 || mm > 12) return false
  const now = new Date()
  const year = 2000 + yy
  const exp = new Date(year, mm, 0, 23, 59, 59)
  return exp >= now
}

export default function OfferDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { state } = useLocation()
  const { isAuthenticated, session } = useContext(AuthContext)

  const [offer, setOffer] = useState(
    state?.offer || {
      id: Number(id),
      title: "Oferta",
      rubro: "Rubro",
      priceRegular: "$0.00",
      priceOffer: "$0.00",
      description: "Cargando detalle...",
      image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
      companyName: "Empresa",
      companyCode: "EMP000",
      useLimitDate: "-"
    }
  )
  const [loadingOffer, setLoadingOffer] = useState(!state?.offer)

  const [qty, setQty] = useState(1)
  const [form, setForm] = useState({
    name: "Juan Andrés Juárez",
    card: "4111 1111 1111 1111",
    exp: "12/29",
    cvv: "123"
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const loadOffer = async () => {
      if (state?.offer) return

      try {
        setLoadingOffer(true)
        const data = await fetchOfertaVigenteById(id)
        if (!data) {
          setError("La oferta no existe o ya no está vigente.")
          return
        }

        setOffer({
          id: data.id,
          title: data.titulo,
          rubro: data.rubro_nombre,
          priceRegular: `$${Number(data.precio_regular).toFixed(2)}`,
          priceOffer: `$${Number(data.precio_oferta).toFixed(2)}`,
          description: data.descripcion,
          image: data.imagen_url || "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
          companyName: data.empresa_codigo,
          companyCode: data.empresa_codigo,
          useLimitDate: data.fecha_limite_uso
        })
      } catch (fetchError) {
        setError(fetchError.message || "No se pudo cargar la oferta.")
      } finally {
        setLoadingOffer(false)
      }
    }

    loadOffer()
  }, [id, state?.offer])

  const canPay = useMemo(() => {
    if (!form.name.trim()) return false
    if (!isValidCardNumber(form.card)) return false
    if (!isValidExpiry(form.exp)) return false
    if (!/^\d{3,4}$/.test(onlyDigits(form.cvv))) return false
    if (Number(qty) < 1) return false
    return true
  }, [form, qty])

  const handlePay = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (!isAuthenticated || !session?.access_token) {
      navigate("/login")
      return
    }

    try {
      setProcessing(true)
      const createdCodes = []

      for (let i = 0; i < Number(qty); i++) {
        const result = await comprarCupon(session.access_token, offer.id)
        createdCodes.push(result.codigo)
      }

      setSuccess(`Compra exitosa. Se generaron ${createdCodes.length} cupón(es).`)
      setTimeout(() => navigate("/mis-cupones"), 900)
    } catch (payError) {
      setError(payError.message || "No se pudo completar la compra.")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-darkBg)] text-[var(--color-textMain)] font-serif">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div className="bg-[var(--color-darkCard)] border border-gray-800 rounded-sm overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="h-72 md:h-full">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8">
              <div className="text-xs uppercase tracking-wider text-[var(--color-textMuted)] mb-2">
                {offer.rubro} • {offer.companyName}
              </div>
              <h1 className="text-4xl font-extrabold text-white leading-tight">
                {offer.title}
              </h1>
              <p className="mt-4 text-[var(--color-textMain)] opacity-90">
                {offer.description}
              </p>

              <div className="mt-6 flex items-end gap-4">
                <div className="text-4xl font-extrabold text-white">
                  {offer.priceOffer}
                </div>
                <div className="text-[var(--color-textMuted)] line-through text-sm font-medium">
                  {offer.priceRegular}
                </div>
              </div>

              <div className="mt-4 text-sm text-[var(--color-textMuted)]">
                Límite para usar cupón:{" "}
                <span className="text-[var(--color-textMain)]">{offer.useLimitDate}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-darkSurface)] border border-gray-800 rounded-sm shadow-[0_0_25px_rgba(0,0,0,0.35)]">
          <div className="p-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold text-white">Pago con tarjeta (simulado)</h2>
                <p className="text-[var(--color-textMuted)] mt-1">Solo usuarios autenticados pueden comprar.</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setForm({
                    name: "Juan Andrés Juárez",
                    card: "4111 1111 1111 1111",
                    exp: "12/29",
                    cvv: "123"
                  })
                }
                className="border border-gray-700 text-[var(--color-textMain)] px-4 py-2 rounded-sm hover:bg-gray-800 transition duration-300"
              >
                Autollenar datos de prueba
              </button>
            </div>

            {loadingOffer ? (
              <div className="mt-6 border border-gray-700 bg-black/30 text-white p-4 rounded-sm">
                Cargando detalle de oferta...
              </div>
            ) : null}

            {error ? (
              <div className="mt-6 border border-[var(--color-accentRed)]/50 bg-black/30 text-white p-4 rounded-sm">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="mt-6 border border-green-500/50 bg-black/30 text-white p-4 rounded-sm">
                {success}
              </div>
            ) : null}

            <form onSubmit={handlePay} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="text-sm text-[var(--color-textMuted)]">Cantidad de cupones</label>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="mt-2 w-full bg-[var(--color-darkBg)] border border-gray-800 px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accentRed)]/60"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-[var(--color-textMuted)]">Nombre en la tarjeta</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-2 w-full bg-[var(--color-darkBg)] border border-gray-800 px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accentRed)]/60"
                  placeholder="Juan Andrés Juárez"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-[var(--color-textMuted)]">Número de tarjeta</label>
                <input
                  value={form.card}
                  onChange={(e) => setForm({ ...form, card: e.target.value })}
                  className="mt-2 w-full bg-[var(--color-darkBg)] border border-gray-800 px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accentRed)]/60"
                  placeholder="4111 1111 1111 1111"
                  inputMode="numeric"
                />
                <div className="mt-2 text-xs text-[var(--color-textMuted)]">
                  Prueba rápida: 4111 1111 1111 1111
                </div>
              </div>

              <div>
                <label className="text-sm text-[var(--color-textMuted)]">Expiración (MM/YY)</label>
                <input
                  value={form.exp}
                  onChange={(e) => setForm({ ...form, exp: e.target.value })}
                  className="mt-2 w-full bg-[var(--color-darkBg)] border border-gray-800 px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accentRed)]/60"
                  placeholder="12/29"
                />
              </div>

              <div>
                <label className="text-sm text-[var(--color-textMuted)]">CVV</label>
                <input
                  type="password"
                  value={form.cvv}
                  onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                  className="mt-2 w-full bg-[var(--color-darkBg)] border border-gray-800 px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accentRed)]/60"
                  placeholder="123"
                  inputMode="numeric"
                />
              </div>

              <div className="md:col-span-2 flex gap-3 flex-wrap pt-2">
                <button
                  disabled={!canPay || processing}
                  className="bg-[var(--color-accentRed)] px-6 py-3 rounded-sm font-bold hover:opacity-90 transition duration-300 text-white shadow-lg shadow-black/30 disabled:opacity-50 disabled:pointer-events-none"
                  type="submit"
                >
                  {processing ? "Procesando..." : "Pagar y generar cupón"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="border border-gray-700 text-[var(--color-textMain)] px-6 py-3 rounded-sm hover:bg-gray-800 transition duration-300"
                >
                  Volver al catálogo
                </button>
              </div>

              <div className="md:col-span-2 text-xs text-[var(--color-textMuted)] pt-2">
                Esto es una simulación (sin cobro real). El cupón se guarda en Supabase ligado a tu usuario.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
