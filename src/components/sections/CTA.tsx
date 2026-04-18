"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { fadeUp } from "@/lib/animations";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export function CTA() {
  return (
    <section className="organic-surface bg-white py-24 text-black md:py-32">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={fadeUp}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <h2 className="text-4xl font-medium leading-tight md:text-5xl lg:text-6xl">
            ¿Listo para probar café de origen?
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-black/62 md:text-lg">
            Escríbenos y te ayudamos a elegir la mejor opción.
          </p>
          <motion.a
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-9 inline-flex min-h-12 items-center justify-center rounded-full border border-[#5F4A32]/45 bg-transparent px-7 py-3 text-sm font-medium text-black transition-colors duration-300 hover:border-[#201914] hover:bg-[#201914] hover:text-white"
          >
            Hablar por WhatsApp
          </motion.a>
        </motion.div>
      </Container>
    </section>
  );
}
