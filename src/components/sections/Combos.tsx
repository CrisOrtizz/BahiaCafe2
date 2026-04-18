"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";

const comboImage =
  "https://images.unsplash.com/photo-1619302286715-2a767f78542f?q=80&w=464&auto=format&fit=crop";

const combos = [
  {
    title: "Combo Inicio",
    description: "Café Mozzura Clásico 250g",
    note: "Ideal para empezar",
  },
  {
    title: "Combo Experiencia",
    description: "Café Mozzura Clásico 500g",
    note: "Para quienes quieren más",
  },
  {
    title: "Combo Completo",
    description: "Café + método + accesorios",
    note: "Experiencia completa",
  },
];

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

export function Combos() {
  return (
    <section className="bg-[#EFEAE3] py-16 text-black md:py-24">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.22 }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-12 max-w-3xl md:mb-16">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-[#6F6A4A]/70">
              COMBOS
            </p>
            <h2 className="text-4xl font-medium leading-tight md:text-5xl lg:text-6xl">
              Selecciones para cada ritual.
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-12"
          >
            {combos.map((combo) => (
              <motion.article key={combo.title} variants={fadeUp}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="group relative aspect-[4/5] overflow-hidden rounded-md bg-[#E4DDD3]"
                >
                  <Image
                    src={comboImage}
                    alt={combo.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/18"
                    aria-hidden="true"
                  />
                </motion.div>

                <div className="mt-6">
                  <h3 className="text-2xl font-medium">{combo.title}</h3>
                  <p className="mt-3 text-base leading-7 text-black/68">
                    {combo.description}
                  </p>
                  <p className="mt-1 text-sm font-medium uppercase tracking-[0.18em] text-[#6F6A4A]/75">
                    {combo.note}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
