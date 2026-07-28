import Link from 'next/link'
import { getSupabaseServer } from '@/lib/supabase/server'
import { GastoForm } from './GastoForm'

export const metadata = { title: 'Gastos — Bahía Café' }

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(n)

const fmtDate = (d: string) =>
  new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(new Date(d + 'T12:00:00'))

const CATS: Record<string, string> = {
  compra_cafe: 'Compra café',
  empaque: 'Empaque',
  logistica: 'Logística',
  marketing: 'Marketing',
  otro: 'Otro',
}

export default async function GastosPage() {
  const supabase = getSupabaseServer()
  const { data: gastos } = await supabase
    .from('gastos')
    .select('id, descripcion, monto, categoria, fecha, notas')
    .order('fecha', { ascending: false })
    .limit(30)

  const totalMes = (gastos ?? [])
    .filter((g) => {
      const d = new Date(g.fecha)
      const now = new Date()
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    })
    .reduce((s, g) => s + Number(g.monto), 0)

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-sm text-cream/50 hover:text-cream">
          ← Dashboard
        </Link>
        <h1 className="text-xl font-bold text-cream">Gastos</h1>
      </div>

      {totalMes > 0 && (
        <div className="rounded-lg border border-white/8 bg-surface px-4 py-3">
          <p className="text-xs text-cream/50">Gastos este mes</p>
          <p className="text-2xl font-bold text-cream">{fmt(totalMes)}</p>
        </div>
      )}

      <GastoForm />

      {(gastos?.length ?? 0) > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cream/50">
            Últimos 30 gastos
          </h2>
          <div className="overflow-x-auto rounded-lg border border-white/8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-left text-xs text-cream/40">
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Descripción</th>
                  <th className="px-4 py-3 font-medium">Categoría</th>
                  <th className="px-4 py-3 font-medium">Monto</th>
                </tr>
              </thead>
              <tbody>
                {gastos!.map((g) => (
                  <tr
                    key={g.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/3"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-cream/60">
                      {fmtDate(g.fecha)}
                    </td>
                    <td className="px-4 py-3 text-cream">
                      {g.descripcion}
                      {g.notas && (
                        <p className="text-xs text-cream/40">{g.notas}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-cream/60">
                      {CATS[g.categoria] ?? g.categoria}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-cream">
                      {fmt(Number(g.monto))}
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
