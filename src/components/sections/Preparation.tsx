"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useState } from "react";
import { Container } from "@/components/ui/Container";

const preparationContent = {
  label: "PREPARACIÓN",
  title: "Aprende a preparar tu café",
  subtext: "Tres métodos, tres formas de disfrutar el origen.",
};

const methods = [
  {
    id: "prensa-francesa",
    name: "Prensa Francesa",
    description: "Más cuerpo, más intensidad.",
    media: {
      type: "video",
      src: "https://res.cloudinary.com/dur2lwfua/video/upload/v1775837897/0409_icr2df.mp4",
    },
  },
  {
    id: "moka-italiana",
    name: "Moka Italiana",
    description: "Fuerte, tradicional y con carácter.",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1772141614991-eea2a95e770c",
    },
  },
  {
    id: "chemex",
    name: "Chemex",
    description: "Limpio, suave y aromático.",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1637944220531-5f6fd15c1e29",
    },
  },
] as const;

type PreparationMethod = (typeof methods)[number];

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: "easeOut" },
  },
};

export function Preparation() {
  const [selectedMethod, setSelectedMethod] =
    useState<PreparationMethod>(methods[0]);

  return (
    <section className="bg-white py-16 text-black md:py-24">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
        >
          <div className="mx-auto max-w-3xl text-center">
            <motion.p
              variants={fadeUp}
              className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-[#6F6A4A]/65"
            >
              {preparationContent.label}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-medium leading-tight md:text-5xl lg:text-6xl"
            >
              {preparationContent.title}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-5 max-w-xl text-base leading-7 text-black/62 md:text-lg"
            >
              {preparationContent.subtext}
            </motion.p>
          </div>

          <motion.div
            variants={fadeUp}
            className="relative mx-auto mt-12 aspect-video max-w-5xl overflow-hidden rounded-lg bg-[#F3F4F2] shadow-[0_24px_70px_rgba(45,36,25,0.12)] md:mt-16"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMethod.id}
                initial={{ opacity: 0, scale: 1.01 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.995 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute inset-0"
              >
                {selectedMethod.media.type === "video" ? (
                  <video
                    aria-label={`Video de ${selectedMethod.name}`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover brightness-[0.82] contrast-[1.06] sepia-[0.06]"
                  >
                    <source src={selectedMethod.media.src} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={selectedMethod.media.src}
                    alt={selectedMethod.name}
                    fill
                    sizes="(min-width: 1024px) 80vw, 100vw"
                    className="object-cover brightness-[0.86] contrast-[1.06] sepia-[0.05]"
                  />
                )}
              </motion.div>
            </AnimatePresence>
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/28 via-black/5 to-white/5"
              aria-hidden="true"
            />
          </motion.div>

          <motion.div
            variants={stagger}
            className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3 md:gap-8"
          >
            {methods.map((method) => {
              const isSelected = method.id === selectedMethod.id;

              return (
                <motion.button
                  key={method.id}
                  type="button"
                  variants={fadeUp}
                  onClick={() => setSelectedMethod(method)}
                  className="group text-left"
                  aria-pressed={isSelected}
                >
                  <span className="block pb-5">
                    <span
                      className={`block text-xl font-medium transition-colors md:text-2xl ${
                        isSelected ? "text-black" : "text-black/58"
                      }`}
                    >
                      {method.name}
                    </span>
                    <span
                      className={`mt-3 block text-base leading-7 transition-colors ${
                        isSelected ? "text-black/68" : "text-black/48"
                      }`}
                    >
                      {method.description}
                    </span>
                  </span>
                  <span
                    className={`block h-px origin-left transition-all duration-300 ${
                      isSelected
                        ? "w-16 bg-[#6F6A4A]"
                        : "w-8 bg-black/18 group-hover:w-12 group-hover:bg-black/35"
                    }`}
                    aria-hidden="true"
                  />
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
