import { Link } from "react-router-dom"

export default function MyCoupons() {
  const all = JSON.parse(localStorage.getItem("coupons") || "[]")

  return (
    <div className="min-h-screen bg-[var(--color-darkBg)] text-[var(--color-textMain)] font-serif">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-wide">Mis Cupones</h1>
            <p className="text-[var(--color-textMuted)] mt-2">
              Cupones generados en la demo (sin login).
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => {
                localStorage.removeItem("coupons")
                window.location.reload()
              }}
              className="border border-gray-700 px-5 py-2 rounded-sm hover:bg-gray-800 transition text-[var(--color-textMain)]"
            >
              Limpiar cupones
            </button>

            <Link
              to="/"
              className="bg-[var(--color-accentRed)] px-5 py-2 rounded-sm font-bold hover:opacity-90 transition text-white shadow-lg shadow-black/30"
            >
              Volver al catálogo
            </Link>
          </div>
        </div>

        <div className="mt-10">
          {all.length === 0 ? (
            <div className="bg-[var(--color-darkSurface)] border border-gray-800 p-10 rounded-sm text-center">
              <h2 className="text-2xl font-bold text-white">Aún no tienes cupones</h2>
              <p className="text-[var(--color-textMuted)] mt-2">
                Compra uno en el catálogo para que aparezca aquí.
              </p>
              <Link
                to="/"
                className="inline-block mt-6 bg-[var(--color-accentRed)] px-8 py-3 rounded-sm font-bold hover:opacity-90 transition text-white"
              >
                Ir al catálogo
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {all.map((c) => (
                <div
                  key={c.id}
                  className="relative bg-[var(--color-darkCard)] border border-gray-800 rounded-sm overflow-hidden shadow-lg"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-accentRed)]" />

                  <div className="p-8">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-textMuted)]">
                          {c.rubro} • {c.companyName}
                        </div>
                        <div className="mt-2 text-2xl font-extrabold text-white">
                          {c.offerTitle}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-[var(--color-textMuted)]">Estado</div>
                        <div
                          className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                            c.status === "disponible"
                              ? "border-green-500/40 text-green-300"
                              : "border-gray-500/40 text-gray-300"
                          }`}
                        >
                          {c.status}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-black/25 border border-gray-700 rounded-sm p-5 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs text-[var(--color-textMuted)]">Código del cupón</div>
                        <div className="mt-1 font-mono text-2xl text-white tracking-wider">
                          {c.code}
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(c.code)
                          } catch (error) {
                            console.error("No se pudo copiar el código:", error)
                          }
                        }}
                        className="border border-gray-700 px-4 py-2 rounded-sm hover:bg-gray-800 transition text-sm"
                      >
                        Copiar
                      </button>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-black/15 border border-gray-800 rounded-sm p-4">
                        <div className="text-[var(--color-textMuted)]">Límite de uso</div>
                        <div className="mt-1 text-white font-semibold">{c.useLimitDate}</div>
                      </div>

                      <div className="bg-black/15 border border-gray-800 rounded-sm p-4">
                        <div className="text-[var(--color-textMuted)]">Precio</div>
                        <div className="mt-1 text-white font-semibold">{c.price}</div>
                      </div>
                    </div>

                    <div className="mt-6 text-xs text-[var(--color-textMuted)]">
                      Generado: {new Date(c.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-8 py-4 border-t border-gray-800 bg-black/10">
                    <div className="text-xs uppercase tracking-widest text-[var(--color-textMuted)]">
                      La Cuponera
                    </div>
                    <div className="text-xs text-[var(--color-textMuted)]">
                      Presenta este código al canjear
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
