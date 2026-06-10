"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { brand, navigationLinks } from "@/data/site";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-gold/15 bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container className="flex h-16 items-center justify-between gap-6 md:h-20">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="shrink-0 font-serif text-lg tracking-wide text-cream transition-colors hover:text-gold md:text-xl"
        >
          {brand.name}
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-8 text-sm md:flex"
        >
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative py-1 text-cream/70 transition-colors duration-300 hover:text-cream"
            >
              {link.label}
              <span
                className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100"
                aria-hidden="true"
              />
            </a>
          ))}
          <a
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-gold/40 px-5 py-2 text-xs font-medium uppercase tracking-[0.18em] text-gold transition-all duration-300 hover:border-gold hover:bg-gold hover:text-background"
          >
            Pedir
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-px w-6 bg-cream transition-transform duration-300 ${
              menuOpen ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-cream transition-transform duration-300 ${
              menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </Container>

      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-background/97 backdrop-blur-lg transition-opacity duration-400 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <Container>
          <nav
            aria-label="Navegación móvil"
            className="flex flex-col gap-7"
          >
            {navigationLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ transitionDelay: menuOpen ? `${index * 60}ms` : "0ms" }}
                className={`font-serif text-4xl text-cream transition-all duration-500 hover:text-gold ${
                  menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              style={{
                transitionDelay: menuOpen
                  ? `${navigationLinks.length * 60}ms`
                  : "0ms",
              }}
              className={`mt-4 inline-flex w-fit items-center rounded-full border border-gold/40 px-7 py-3 text-sm font-medium uppercase tracking-[0.18em] text-gold transition-all duration-500 ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              Pedir por WhatsApp
            </a>
          </nav>
        </Container>
      </div>
    </header>
  );
}
