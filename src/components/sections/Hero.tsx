"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const heroContent = {
  label: "BAHÍA CAFÉ",
  heading: "Café de origen colombiano.",
  subtext: "Llevado a la costa.",
};

const heroVideoUrl =
  "https://res.cloudinary.com/dur2lwfua/video/upload/v1775924868/14019845_3840_2160_60fps_aysdiv.mp4";

const textStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2,
    },
  },
};

const textReveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export function Hero() {
  return (
    <section className="relative flex h-[100svh] min-h-[520px] items-center overflow-hidden bg-black text-white">
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

      <div
        className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/55 to-black/30"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.08),transparent_32%)]"
        aria-hidden="true"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={textStagger}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-start px-5 text-left sm:px-6 lg:px-8"
      >
        <div className="max-w-[22rem] sm:max-w-xl">
          <motion.p
            variants={textReveal}
            className="mb-5 text-xs font-semibold uppercase text-white/75 sm:mb-6 sm:text-sm"
          >
            {heroContent.label}
          </motion.p>
          <motion.h1
            variants={textReveal}
            className="text-5xl font-bold leading-[0.94] text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {heroContent.heading}
          </motion.h1>
          <motion.p
            variants={textReveal}
            className="mt-6 text-base font-medium text-white/72 sm:mt-7 sm:text-xl"
          >
            {heroContent.subtext}
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-white/70 sm:bottom-8"
        aria-hidden="true"
      >
        <span className="h-10 w-px overflow-hidden bg-white/25">
          <motion.span
            animate={{ y: ["-100%", "120%"] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
            className="block h-1/2 w-px bg-white"
          />
        </span>
        <span className="text-[0.65rem] font-medium uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}
