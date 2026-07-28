'use server'
import { getSupabaseServer } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type GastoState = { error: string } | { success: true } | null

export async function registrarGasto(
  _prev: GastoState,
  formData: FormData
): Promise<GastoState> {
  const descripcion = (formData.get('descripcion') as string)?.trim()
  const monto = Number(formData.get('monto'))
  const categoria = formData.get('categoria') as string
  const fecha = formData.get('fecha') as string
  const notas = (formData.get('notas') as string)?.trim() || null

  if (!descripcion) return { error: 'Agrega una descripción' }
  if (!monto || monto <= 0) return { error: 'El monto debe ser mayor a 0' }
  if (!fecha) return { error: 'Selecciona una fecha' }

  const supabase = getSupabaseServer()
  const { error } = await supabase
    .from('gastos')
    .insert({ descripcion, monto, categoria, fecha, notas })

  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/admin/gastos')
  return { success: true }
}
