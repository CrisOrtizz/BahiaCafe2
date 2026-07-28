import Link from 'next/link'
import { getSupabaseServer } from '@/lib/supabase/server'
import { SaleForm } from './SaleForm'

export const metadata = { title: 'Nueva venta — Bahía Café' }

export default async function NuevaVentaPage() {
  const supabase = getSupabaseServer()

  const [productosRes, clientesRes] = await Promise.all([
    supabase
      .from('productos')
      .select('id, nombre, presentacion, precio_venta')
      .eq('activo', true)
      .order('nombre'),
    supabase
      .from('clientes')
      .select('id, nombre, telefono')
      .order('nombre'),
  ])

  const productos = productosRes.data ?? []
  const clientes = clientesRes.data ?? []

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin"
          className="text-sm text-cream/50 hover:text-cream"
        >
          ← Dashboard
        </Link>
        <h1 className="text-xl font-bold text-cream">Nueva venta</h1>
      </div>

      {productos.length === 0 ? (
        <p className="rounded-lg border border-white/8 bg-surface px-4 py-8 text-center text-sm text-cream/50">
          No hay productos activos. Agrega productos desde la base de datos primero.
        </p>
      ) : (
        <SaleForm productos={productos} clientes={clientes} />
      )}
    </div>
  )
}
