"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";

const preparationContent = {
  label: "PREPARACIÓN",
  title: "Aprende a preparar tu café",
  subtext: "Tres métodos, tres formas de disfrutar el origen.",
};

const videoUrl =
  "https://res.cloudinary.com/dur2lwfua/video/upload/v1775837897/0409_icr2df.mp4";

const methods = [
  {
    name: "Prensa Francesa",
    description: "Más cuerpo, más intensidad.",
    media: {
      type: "video",
      src: videoUrl,
    },
  },
  {
    name: "Moka Italiana",
    description: "Fuerte, tradicional y con carácter.",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1772141614991-eea2a95e770c?q=80&w=387&auto=format&fit=crop",
    },
  },
  {
    name: "Chemex",
    description: "Limpio, suave y aromático.",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1637944220531-5f6fd15c1e29?q=80&w=377&auto=format&fit=crop",
    },
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

export function Experience() {
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
            <video
              aria-label="Video de preparación de café"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover brightness-[0.82] contrast-[1.06] sepia-[0.06]"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/28 via-black/5 to-white/5"
              aria-hidden="true"
            />
          </motion.div>

          <motion.div
            variants={stagger}
            className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-12"
          >
            {methods.map((method) => (
              <motion.article
                key={method.name}
                variants={fadeUp}
                className="group max-w-sm"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="relative aspect-[4/5] overflow-hidden rounded-md bg-[#F3F4F2]"
                >
                  {method.media.type === "video" ? (
                    <video
                      aria-label={`Vista previa de ${method.name}`}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover brightness-[0.86] contrast-[1.05] sepia-[0.05]"
                    >
                      <source src={method.media.src} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={method.media.src}
                      alt={method.name}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover brightness-[0.9] contrast-[1.05] sepia-[0.04]"
                    />
                  )}
                  <div
                    className="absolute inset-0 bg-black/8 transition-colors duration-500 group-hover:bg-black/18"
                    aria-hidden="true"
                  />
                </motion.div>

                <h3 className="mt-6 text-2xl font-medium">{method.name}</h3>
                <p className="mt-3 text-base leading-7 text-black/60">
                  {method.description}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
