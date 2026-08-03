import { LoginForm } from './LoginForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Acceso admin — Bahía Café', robots: 'noindex' }

type Props = { searchParams: Promise<{ from?: string }> }

export default async function LoginPage({ searchParams }: Props) {
  const { from = '/admin' } = await searchParams

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="mb-1 font-display text-xl font-semibold tracking-wide text-gold">
          Bahía Café
        </p>
        <h1 className="mb-8 text-2xl font-bold text-cream">Panel admin</h1>
        <LoginForm from={from} />
      </div>
    </div>
  )
}
