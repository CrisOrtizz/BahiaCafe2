'use server'
import { getSupabaseServer } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type CompraItem = {
  producto_id: string
  cantidad: number
  costo_unitario: number
}

export type CompraState = { error: string } | { compraId: string } | null

export async function registrarCompra(
  items: CompraItem[],
  envio: number,
  categoria: string,
  fecha: string,
  notas: string | null
): Promise<CompraState> {
  if (items.length === 0) return { error: 'Agrega al menos un producto' }

  const supabase = getSupabaseServer()
  const { data, error } = await supabase.rpc('registrar_compra', {
    p_items: items,
    p_envio: envio,
    p_categoria: categoria,
    p_fecha: fecha,
    p_notas: notas,
  })

  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/admin/compras')
  return { compraId: data as string }
}
