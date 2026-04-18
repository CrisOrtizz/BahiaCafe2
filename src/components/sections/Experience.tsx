"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { sections } from "@/data/site";
import { fadeUp } from "@/lib/animations";

export function Experience() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
            {sections.experience.title}
          </h2>
          <p className="max-w-2xl text-gray-700">{sections.experience.body}</p>
        </motion.div>
      </Container>
    </section>
  );
}
