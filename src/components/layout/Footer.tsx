import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { brand, navigationLinks } from "@/data/site";
import { generateWhatsAppLink } from "@/lib/whatsapp";

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.5 7.5 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.1.2-.2.2-.4.1-.1 0-.3 0-.4L9.5 8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.7 4.3 3.8.6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.6-.4Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-background">
      <div className="gold-divider" aria-hidden="true" />
      <Container className="flex flex-col items-center py-16 text-center md:py-20">
        <Link
          href="/"
          className="font-serif text-3xl text-cream transition-colors hover:text-gold md:text-4xl"
        >
          {brand.name}
        </Link>

        <p className="mt-4 max-w-md text-sm leading-6 text-cream/55 md:text-base">
          {brand.tagline}
        </p>

        <nav
          aria-label="Navegación del pie de página"
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm"
        >
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-cream/60 transition-colors duration-300 hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mt-10 flex items-center gap-6">
          <a
            href={brand.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Bahía Café"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-all duration-300 hover:border-gold hover:text-gold"
          >
            <InstagramIcon />
          </a>
          <a
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp de Bahía Café"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-all duration-300 hover:border-gold hover:text-gold"
          >
            <WhatsAppIcon />
          </a>
        </div>

        <p className="mt-12 text-xs tracking-wide text-cream/35">
          © {new Date().getFullYear()} {brand.name} · Líbano, Tolima, Colombia
        </p>
      </Container>
    </footer>
  );
}
