import Link from 'next/link'
import { logoutAction } from '@/lib/auth-actions'

export const metadata = { title: 'Admin — Bahía Café', robots: 'noindex' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-white/8 bg-surface/95 px-4 backdrop-blur-sm">
        <Link
          href="/admin"
          className="font-display text-base font-semibold tracking-wide text-gold"
        >
          Bahía Café <span className="text-sm font-normal text-cream/50">Admin</span>
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href="/admin/gastos"
            className="rounded-lg border border-amber/40 px-2 py-1.5 text-xs font-medium text-amber transition-colors hover:bg-amber/10 sm:px-3 sm:text-sm"
          >
            + Gasto
          </Link>
          <Link
            href="/admin/nueva-venta"
            className="rounded-lg bg-teal px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-light sm:px-3 sm:text-sm"
          >
            + Venta
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-white/15 px-2 py-1.5 text-xs text-cream/60 transition-colors hover:border-white/30 hover:text-cream sm:px-3 sm:text-sm"
            >
              Salir
            </button>
          </form>
        </nav>
      </header>

      <main className="flex-1 px-4 py-6">{children}</main>
    </div>
  )
}
