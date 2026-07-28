'use server'
import { getSupabaseServer } from '@/lib/supabase/server'

export type CartItem = {
  productoId: string
  nombre: string
  presentacion: string
  precio: number
  cantidad: number
  descuento: number  // descuento por unidad
}

type RegisterParams = {
  clienteId: string | null
  nuevoCliente: { nombre: string; telefono: string } | null
  items: CartItem[]
  metodoPago: string
  fecha: string   // YYYY-MM-DD
  estado: 'pagado' | 'pendiente'
}

export type RegisterResult = { ventaId: string } | { error: string }

export async function registrarVenta(params: RegisterParams): Promise<RegisterResult> {
  if (params.items.length === 0) return { error: 'El carrito está vacío' }

  const supabase = getSupabaseServer()
  let clienteId = params.clienteId

  if (!clienteId) {
    if (!params.nuevoCliente?.nombre?.trim()) {
      return { error: 'Ingresa el nombre del cliente' }
    }
    const { data, error } = await supabase
      .from('clientes')
      .insert({
        nombre: params.nuevoCliente.nombre.trim(),
        telefono: params.nuevoCliente.telefono?.trim() || null,
      })
      .select('id')
      .single()

    if (error || !data) return { error: 'Error al crear el cliente' }
    clienteId = data.id
  }

  const items = params.items.map((item) => ({
    producto_id: item.productoId,
    cantidad: item.cantidad,
    precio_unitario: item.precio,
    descuento: item.descuento,
    subtotal: (item.precio - item.descuento) * item.cantidad,
  }))

  const { data, error } = await supabase.rpc('registrar_venta', {
    p_cliente_id: clienteId,
    p_metodo_pago: params.metodoPago,
    p_items: items,
    p_fecha: params.fecha,
    p_estado: params.estado,
  })

  if (error) return { error: error.message }
  return { ventaId: data as string }
}
