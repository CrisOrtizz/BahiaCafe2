import type { CSSProperties } from "react";
import { brand } from "@/data/site";

const heroContent = {
  label: "Líbano · Tolima · Colombia",
  heading: "Café de origen colombiano.",
  subtext: "Llevado a la costa.",
};

const heroVideoUrl =
  "https://res.cloudinary.com/dur2lwfua/video/upload/v1775924868/14019845_3840_2160_60fps_aysdiv.mp4";

const riseDelay = (seconds: number) =>
  ({ "--rise-delay": `${seconds}s` }) as CSSProperties;

export function Hero() {
  return (
    <section className="relative flex h-[100svh] min-h-[560px] items-center overflow-hidden bg-background">
      <video
        aria-hidden="true"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full scale-[1.05] object-cover brightness-[0.72] contrast-[1.12] sepia-[0.08]"
      >
        <source src={heroVideoUrl} type="video/mp4" />
      </video>

      {/* Overlay gradiente oscuro para legibilidad */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/45 to-background"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(13,11,8,0.55)_100%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 text-center sm:px-6">
        <p
          style={riseDelay(0.2)}
          className="hero-rise mb-6 text-xs font-medium uppercase tracking-[0.4em] text-gold sm:text-sm"
        >
          {heroContent.label}
        </p>
        <h1
          style={riseDelay(0.4)}
          className="hero-rise font-serif text-5xl leading-[1.04] text-cream sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {heroContent.heading}
        </h1>
        <p
          style={riseDelay(0.62)}
          className="hero-rise mt-7 font-serif text-xl italic text-cream/75 sm:text-2xl md:text-3xl"
        >
          {heroContent.subtext}
        </p>
        <div
          style={riseDelay(0.85)}
          className="hero-rise mt-10 flex items-center gap-4"
          aria-hidden="true"
        >
          <span className="gold-divider w-16" />
          <span className="text-[0.65rem] uppercase tracking-[0.32em] text-cream/55">
            {brand.name}
          </span>
          <span className="gold-divider w-16" />
        </div>
      </div>

      {/* Indicador de scroll animado */}
      <div
        style={riseDelay(1.2)}
        className="hero-rise absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-8"
        aria-hidden="true"
      >
        <span className="block h-12 w-px overflow-hidden bg-gold/20">
          <span className="scroll-hint block h-1/2 w-px bg-gold" />
        </span>
        <span className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-cream/50">
          Scroll
        </span>
      </div>
    </section>
  );
}
