import Link from 'next/link'
import { getSupabaseServer } from '@/lib/supabase/server'
import { CompraForm } from './CompraForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Compras — Bahía Café' }

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(n)

const fmtDate = (d: string) =>
  new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(
    new Date(d + 'T12:00:00')
  )

export default async function ComprasPage() {
  const supabase = getSupabaseServer()

  const [productosRes, comprasRes] = await Promise.all([
    supabase
      .from('productos')
      .select('id, nombre, presentacion, costo')
      .eq('activo', true)
      .order('nombre'),
    supabase
      .from('gastos')
      .select('id, descripcion, monto, fecha, notas')
      .eq('categoria', 'compra_cafe')
      .order('fecha', { ascending: false })
      .limit(30),
  ])

  const productos = productosRes.data ?? []
  const compras = comprasRes.data ?? []

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-sm text-cream/50 hover:text-cream">
          ← Dashboard
        </Link>
        <h1 className="text-xl font-bold text-cream">Compras de café</h1>
      </div>

      {productos.length === 0 ? (
        <p className="rounded-lg border border-white/8 bg-surface px-4 py-8 text-center text-sm text-cream/50">
          No hay productos activos. Agrega productos desde la base de datos primero.
        </p>
      ) : (
        <CompraForm productos={productos} />
      )}

      {compras.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cream/50">
            Últimas 30 compras
          </h2>
          <div className="overflow-x-auto rounded-lg border border-white/8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-left text-xs text-cream/40">
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Descripción / Notas</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/3"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-cream/60">
                      {fmtDate(c.fecha)}
                    </td>
                    <td className="px-4 py-3 text-cream">
                      {c.descripcion}
                      {c.notas && (
                        <p className="text-xs text-cream/40">{c.notas}</p>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gold">
                      {fmt(Number(c.monto))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
