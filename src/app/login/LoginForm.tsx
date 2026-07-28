'use client'
import { useActionState } from 'react'
import { loginAction } from './_actions'
import type { LoginState } from './_actions'

export function LoginForm({ from }: { from: string }) {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    null
  )

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="from" value={from} />

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm text-cream/60">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-cream placeholder-cream/30 outline-none focus:border-teal focus:ring-1 focus:ring-teal"
          placeholder="••••••••"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-900/30 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-lg bg-teal px-6 py-3 font-medium text-white transition-colors hover:bg-teal-light disabled:opacity-50"
      >
        {isPending ? 'Verificando…' : 'Entrar'}
      </button>
    </form>
  )
}
