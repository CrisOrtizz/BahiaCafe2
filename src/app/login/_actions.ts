'use server'
import { createSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export type LoginState = { error: string } | null

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = formData.get('password') as string
  const from = (formData.get('from') as string) || '/admin'

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Contraseña incorrecta' }
  }

  await createSession()
  redirect(from)
}
