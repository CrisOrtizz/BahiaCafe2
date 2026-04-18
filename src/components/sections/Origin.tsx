"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";

const originContent = {
  label: "ORIGEN",
  title: "Líbano, Tolima",
  lines: [
    "Nuestro café nace en las montañas de Tolima.",
    "Cultivado por manos expertas,",
    "respetando cada etapa del proceso.",
    "Cada taza cuenta esa historia.",
  ],
};

const textStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.18,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: "easeOut" },
  },
};

const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export function Origin() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section
      ref={sectionRef}
      id="origin"
      className="overflow-hidden bg-[#EFE8DC] py-16 text-black md:py-24"
    >
      <Container>
        <div className="grid items-center gap-10 md:gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={imageReveal}
            className="relative h-[380px] overflow-hidden sm:h-[460px] md:h-[520px] lg:h-[62vh]"
          >
            <motion.div style={{ y: imageY }} className="absolute inset-0">
              <Image
                src="/images/libano-tolima-generada.png"
                alt="Paisaje cafetero en Líbano, Tolima"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="scale-105 object-cover"
                priority={false}
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={textStagger}
            className="max-w-lg lg:pt-12"
          >
            <motion.p
              variants={fadeUp}
              className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-[#7B7657]/70 md:mb-6"
            >
              {originContent.label}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mb-6 text-5xl font-medium leading-[1] text-black md:mb-8 md:text-6xl lg:text-7xl"
            >
              {originContent.title}
            </motion.h2>
            <div className="space-y-2 text-base leading-7 text-black/70 sm:text-lg sm:leading-8">
              {originContent.lines.map((line, index) => (
                <motion.p
                  key={line}
                  variants={fadeUp}
                  className={index === 3 ? "pt-5" : ""}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
