"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const preparationContent = {
  label: "Preparación",
  title: "Aprende a preparar tu café",
  subtext: "Tres métodos, tres formas de disfrutar el origen.",
};

const methods = [
  {
    id: "prensa-francesa",
    name: "Prensa Francesa",
    description:
      "Inmersión total durante cuatro minutos. Más cuerpo, más intensidad y toda la textura del grano en la taza.",
    media: {
      type: "video",
      src: "https://res.cloudinary.com/dur2lwfua/video/upload/v1775837897/0409_icr2df.mp4",
    },
  },
  {
    id: "moka-italiana",
    name: "Moka Italiana",
    description:
      "Presión de vapor sobre la estufa. Fuerte, tradicional y con carácter: el ritual de las cocinas de siempre.",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1772141614991-eea2a95e770c",
    },
  },
  {
    id: "chemex",
    name: "Chemex",
    description:
      "Filtrado lento y preciso. Limpio, suave y aromático: ideal para apreciar las notas del origen.",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1637944220531-5f6fd15c1e29",
    },
  },
] as const;

type PreparationMethod = (typeof methods)[number];

export function Preparation() {
  const [selectedMethod, setSelectedMethod] = useState<PreparationMethod>(
    methods[0],
  );

  return (
    <section id="preparation" className="relative bg-background py-20 md:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Reveal as="p">
            <span className="block text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              {preparationContent.label}
            </span>
          </Reveal>
          <Reveal as="h2" delay={120}>
            <span className="heading-section mt-6 block leading-[1.12] text-cream">
              {preparationContent.title}
            </span>
          </Reveal>
          <Reveal as="p" delay={220}>
            <span className="mx-auto mt-5 block max-w-xl text-base leading-7 text-cream/55 md:text-lg">
              {preparationContent.subtext}
            </span>
          </Reveal>
        </div>

        {/* Tabs de métodos */}
        <Reveal delay={300}>
          <div
            role="tablist"
            aria-label="Métodos de preparación"
            className="mt-12 flex flex-wrap items-center justify-center gap-3 md:gap-4"
          >
            {methods.map((method) => {
              const isSelected = method.id === selectedMethod.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedMethod(method)}
                  className={`rounded-full border px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                    isSelected
                      ? "border-gold bg-gold text-background"
                      : "border-cream/15 text-cream/60 hover:border-gold/50 hover:text-cream"
                  }`}
                >
                  {method.name}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Media del método activo */}
        <Reveal delay={380}>
          <div className="relative mx-auto mt-10 aspect-video max-w-5xl overflow-hidden rounded-2xl border border-cream/8 bg-surface shadow-[0_40px_90px_-20px_rgba(0,0,0,0.6)] md:mt-12">
            {selectedMethod.media.type === "video" ? (
              <video
                key={selectedMethod.id}
                aria-label={`Video de ${selectedMethod.name}`}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover brightness-[0.85] contrast-[1.06] sepia-[0.06]"
              >
                <source src={selectedMethod.media.src} type="video/mp4" />
              </video>
            ) : (
              <Image
                key={selectedMethod.id}
                src={selectedMethod.media.src}
                alt={selectedMethod.name}
                fill
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="object-cover brightness-[0.88] contrast-[1.06] sepia-[0.05]"
              />
            )}
            <div
              className="absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent"
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <h3 className="font-display text-2xl text-cream md:text-3xl">
                {selectedMethod.name}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-cream/70 md:text-base">
                {selectedMethod.description}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
