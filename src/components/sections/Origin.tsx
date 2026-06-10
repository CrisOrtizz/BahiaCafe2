"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const originContent = {
  label: "Origen",
  quote: "Desde las montañas de Tolima",
  title: "Líbano, Tolima",
  lines: [
    "Nuestro café nace a más de 1.500 metros sobre el nivel del mar, donde la niebla y el sol se turnan el día.",
    "Cultivado por manos expertas que respetan cada etapa del proceso: la siembra, la recolección, el secado y el tueste.",
    "Cada taza cuenta esa historia.",
  ],
};

export function Origin() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Parallax suave con scroll nativo, sin librerías externas.
  useEffect(() => {
    const node = parallaxRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      const rect = node.getBoundingClientRect();
      const progress =
        (rect.top + rect.height / 2 - window.innerHeight / 2) /
        window.innerHeight;
      node.style.transform = `translateY(${progress * -30}px) scale(1.1)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="origin"
      className="relative overflow-hidden bg-background py-20 md:py-32"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* Imagen izquierda con parallax y sombra cálida */}
          <Reveal>
            <div className="relative h-[400px] overflow-hidden rounded-[2rem] shadow-[0_40px_90px_-20px_rgba(200,151,74,0.18)] sm:h-[480px] md:h-[540px] lg:h-[64vh]">
              <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
                <Image
                  src="/images/libano-tolima-generada.png"
                  alt="Paisaje cafetero en Líbano, Tolima"
                  fill
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div
                className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-gold/15"
                aria-hidden="true"
              />
            </div>
          </Reveal>

          {/* Texto derecha */}
          <div className="max-w-xl">
            <Reveal as="p" delay={80}>
              <span className="block text-xs font-semibold uppercase tracking-[0.4em] text-gold">
                {originContent.label}
              </span>
            </Reveal>

            <Reveal delay={180}>
              <blockquote className="mt-7 border-l-2 border-gold/50 pl-6 font-serif text-3xl italic leading-snug text-cream sm:text-4xl md:text-5xl">
                &ldquo;{originContent.quote}&rdquo;
              </blockquote>
            </Reveal>

            <Reveal as="h2" delay={280}>
              <span className="mt-9 block font-serif text-2xl text-gold/90 sm:text-3xl">
                {originContent.title}
              </span>
            </Reveal>

            <div className="mt-6 space-y-5 text-base leading-8 text-cream/65 sm:text-lg">
              {originContent.lines.map((line, index) => (
                <Reveal key={line} as="p" delay={360 + index * 110}>
                  {line}
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
