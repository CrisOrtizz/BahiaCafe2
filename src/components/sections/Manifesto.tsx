"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";

const manifestoLines = [
  "No es solo café.",
  "Es origen, proceso y cultura.",
  "Desde las montañas de Tolima",
  "hasta las tazas en la costa.",
];

const lineStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

const lineReveal: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.78, ease: "easeOut" },
  },
};

const lineStyles = [
  "text-5xl font-semibold leading-[0.98] sm:text-6xl md:text-7xl lg:text-8xl",
  "mt-4 text-4xl font-semibold leading-[1.02] text-black/90 sm:text-5xl md:text-6xl lg:text-7xl",
  "mt-12 text-2xl font-normal leading-[1.18] text-black/60 sm:text-3xl md:mt-14 md:text-4xl",
  "mt-3 text-2xl font-normal leading-[1.18] text-black/60 sm:text-3xl md:text-4xl",
];

export function Manifesto() {
  return (
    <section id="manifesto" className="bg-white py-16 text-black md:py-24">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={lineStagger}
          className="max-w-3xl"
        >
          {manifestoLines.map((line, index) => (
            <motion.p
              key={line}
              variants={lineReveal}
              className={lineStyles[index]}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
