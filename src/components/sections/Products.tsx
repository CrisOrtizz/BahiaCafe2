"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { products } from "@/data/products";

const sectionCopy = {
  label: "PRODUCTOS",
  title: "Cafés para beber con calma.",
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.76, ease: "easeOut" },
  },
};

export function Products() {
  return (
    <section id="products" className="bg-white py-16 text-black md:py-24">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
          className="mb-12 max-w-3xl md:mb-20"
        >
          <motion.p
            variants={fadeUp}
            className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-black/45 md:mb-6"
          >
            {sectionCopy.label}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-5xl font-medium leading-[1] md:text-6xl lg:text-7xl"
          >
            {sectionCopy.title}
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={stagger}
          className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-14 md:gap-y-16 lg:gap-x-20"
        >
          {products.map((product, index) => (
            <motion.article
              key={product.id}
              variants={fadeUp}
              className={index % 2 === 1 ? "md:mt-16" : ""}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="group relative aspect-[5/4] overflow-hidden bg-neutral-100 sm:aspect-square"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={() => console.log("IMAGE PATH:", product.image)}
                />
                <div
                  className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10"
                  aria-hidden="true"
                />
              </motion.div>

              <div className="mt-5 max-w-md sm:mt-6">
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.22em] text-black/45">
                  {product.notes}
                </p>
                <h3 className="text-2xl font-medium md:text-3xl">
                  {product.name}
                </h3>
                <p className="mt-3 text-lg font-medium text-black/78 md:mt-4 md:text-xl">
                  {product.price}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
