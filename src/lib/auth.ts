import 'server-only'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'bahia_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 8 // 8 horas

// Deriva un token HMAC-SHA256 desde ADMIN_PASSWORD.
// Si la contraseña cambia, todos los tokens viejos quedan inválidos.
export async function deriveToken(): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(process.env.ADMIN_PASSWORD!),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode('bahia-cafe-admin-v1')
  )
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function createSession(): Promise<void> {
  const token = await deriveToken()
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

export async function destroySession(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

export async function verifySession(): Promise<boolean> {
  const store = await cookies()
  const cookie = store.get(SESSION_COOKIE)
  if (!cookie?.value) return false
  const expected = await deriveToken()
  return cookie.value === expected
}
