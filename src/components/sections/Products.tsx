"use client";

import Image from "next/image";
import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { products, type Product } from "@/data/products";
import { generateWhatsAppLink } from "@/lib/whatsapp";

const sectionCopy = {
  label: "Productos",
  title: "Cafés para beber con calma.",
};

const CARD_GAP = 28;
// Spring que da la sensación de peso e inercia tipo Apple/Linear.
const SPRING = { stiffness: 55, damping: 22, mass: 0.9 };
// Tarjeta inicial centrada: Mozzura Clásico 500g (índice 1).
const INITIAL_INDEX = 1;

// ─── Tarjeta individual ───────────────────────────────────────────────────────

function ProductCard({
  product,
  index,
  trackX,
  cardWidth,
  trackOffsetRef,
}: {
  product: Product;
  index: number;
  trackX: MotionValue<number>;
  cardWidth: number;
  trackOffsetRef: { current: number };
}) {
  // Centro del card dentro del track (constante por card).
  const cardCenter = index * (cardWidth + CARD_GAP) + cardWidth / 2;

  // Distancia al centro visual del viewport — recalculada cada frame via spring.
  const distFromCenter = useTransform(trackX, (x) =>
    Math.abs(trackOffsetRef.current + cardCenter + x),
  );

  // Efectos visuales continuos: sin estados discretos, todo es gradiente.
  const scale = useTransform(distFromCenter, [0, 340], [1, 0.84], {
    clamp: true,
  });
  const opacity = useTransform(distFromCenter, [0, 380], [1, 0.36], {
    clamp: true,
  });
  const brightness = useTransform(distFromCenter, [0, 300], [1.08, 0.8], {
    clamp: true,
  });
  const filter = useTransform(brightness, (b) => `brightness(${b})`);
  const zIndex = useTransform(distFromCenter, (d) =>
    Math.round(100 - d * 0.25),
  );
  const shadowAlpha = useTransform(distFromCenter, [0, 200], [0.22, 0], {
    clamp: true,
  });
  const boxShadow = useTransform(
    shadowAlpha,
    (a) => `0 32px 80px rgba(200, 151, 74, ${a.toFixed(3)})`,
  );
  const borderAlpha = useTransform(distFromCenter, [0, 200], [0.42, 0.07], {
    clamp: true,
  });
  const borderColor = useTransform(
    borderAlpha,
    (a) => `rgba(200, 151, 74, ${a.toFixed(3)})`,
  );

  return (
    <motion.div
      className="flex-none overflow-hidden rounded-[20px] bg-surface"
      style={{
        width: cardWidth,
        scale,
        opacity,
        zIndex,
        filter,
        boxShadow,
        border: "1px solid",
        borderColor,
      }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 640px) 340px, 80vw"
          draggable={false}
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-surface/85 via-transparent to-transparent"
          aria-hidden
        />
      </div>

      <div className="p-6 sm:p-7">
        <ul className="flex flex-wrap gap-2" aria-label="Notas de sabor">
          {product.notes.map((note) => (
            <li
              key={note}
              className="rounded-full border border-gold/30 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-gold/90"
            >
              {note}
            </li>
          ))}
        </ul>
        <h3 className="mt-4 font-display text-2xl font-semibold text-cream">
          {product.name}
        </h3>
        <p className="mt-2 text-sm leading-6 text-cream/55">
          {product.description}
        </p>
        <p className="mt-4 font-display text-3xl font-semibold text-gold">
          {product.price}
        </p>
        <a
          href={generateWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-gold/45 px-6 text-sm font-medium uppercase tracking-[0.16em] text-gold transition-all duration-300 hover:bg-gold hover:text-background"
        >
          Pedir por WhatsApp
        </a>
      </div>
    </motion.div>
  );
}

// ─── Galería ──────────────────────────────────────────────────────────────────

export function Products() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs de geometría: actualizados en medición, leídos en transforms por frame.
  const trackOffsetRef = useRef<number>(0); // padding - containerWidth/2
  const trackXAtZeroRef = useRef<number>(0); // trackX cuando el primer card está centrado
  const fullRangeRef = useRef<number>(0); // distancia total de recorrido del track

  const [cardWidth, setCardWidth] = useState(320);

  // progress ∈ [0, 1]: 0 = primer card centrado, 1 = último card centrado.
  const initialProgress = INITIAL_INDEX / (products.length - 1);
  const mouseProgress = useMotionValue(initialProgress);
  const smoothProgress = useSpring(mouseProgress, SPRING);

  // Posición X del track: mapea el progreso al desplazamiento real en píxeles.
  const trackX = useTransform(
    smoothProgress,
    (p) => trackXAtZeroRef.current - p * fullRangeRef.current,
  );

  // Mide el contenedor y actualiza todos los refs de geometría.
  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const cw = el.offsetWidth;
    const padding = cw * 0.1;
    const newCardWidth = Math.min(340, Math.floor((cw - padding * 2) * 0.76));

    setCardWidth(newCardWidth);
    // trackOffset = distancia entre el inicio del track y el centro del viewport.
    trackOffsetRef.current = padding - cw / 2;
    // Cuando progress=0, el primer card debe estar centrado → trackX positivo.
    trackXAtZeroRef.current = cw / 2 - padding - newCardWidth / 2;
    // El recorrido total cubre todos los cards: (N-1) saltos.
    fullRangeRef.current = (products.length - 1) * (newCardWidth + CARD_GAP);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measure]);

  // Mouse: posición horizontal dentro del contenedor → progreso 0–1.
  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      mouseProgress.set(p);
    },
    [mouseProgress],
  );

  // Touch: arrastrar horizontalmente controla el progreso.
  const touchRef = useRef<{ x: number; p: number } | null>(null);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchRef.current = { x: e.touches[0].clientX, p: mouseProgress.get() };
    },
    [mouseProgress],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchRef.current) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Arrastrar izquierda (dx < 0) → avanzar en la galería (p sube).
      const dx = e.touches[0].clientX - touchRef.current.x;
      const newP = Math.max(0, Math.min(1, touchRef.current.p - dx / rect.width));
      mouseProgress.set(newP);
    },
    [mouseProgress],
  );

  return (
    <section
      id="products"
      className="relative overflow-hidden bg-background py-20 md:py-32"
    >
      <Container>
        <div className="mb-10 max-w-3xl md:mb-14">
          <Reveal as="p">
            <span className="block text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              {sectionCopy.label}
            </span>
          </Reveal>
          <Reveal as="h2" delay={120}>
            <span className="heading-section mt-6 block leading-[1.12] text-cream">
              {sectionCopy.title}
            </span>
          </Reveal>
        </div>
      </Container>

      <Reveal delay={220}>
        {/* overflow-hidden recorta los cards laterales; py-14 da espacio al scale */}
        <div
          ref={containerRef}
          className="relative overflow-hidden cursor-none py-14"
          style={{ paddingInline: "10vw", touchAction: "none" }}
          onMouseMove={onMouseMove}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
        >
          <motion.div
            className="flex items-start"
            style={{ x: trackX, gap: `${CARD_GAP}px` }}
          >
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                trackX={trackX}
                cardWidth={cardWidth}
                trackOffsetRef={trackOffsetRef}
              />
            ))}
          </motion.div>
        </div>
      </Reveal>

      <Container>
        <Reveal delay={300}>
          <p className="mt-6 text-center text-[0.65rem] uppercase tracking-[0.28em] text-cream/35">
            Mueve el cursor para explorar
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
