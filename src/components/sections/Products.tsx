"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { products, type Product } from "@/data/products";
import { generateWhatsAppLink } from "@/lib/whatsapp";

const sectionCopy = {
  label: "Productos",
  title: "Cafés para beber con calma.",
};

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const SWIPE_THRESHOLD = 48;
const WHEEL_DEBOUNCE_MS = 600;

/* Coverflow en tres niveles de profundidad: el card activo se acerca con
   translateZ(80px), los vecinos retroceden y rotan, los lejanos se hunden más. */
function coverflowStyle(offset: number, isEntering: boolean): CSSProperties {
  const distance = Math.abs(offset);
  const side = Math.sign(offset);

  let transform: string;
  let opacity: number;
  if (distance === 0) {
    transform = "translateX(-50%) translateZ(80px) rotateY(0deg) scale(1)";
    opacity = 1;
  } else if (distance === 1) {
    transform = `translateX(calc(-50% + ${side * 55}%)) translateZ(-40px) rotateY(${side * -45}deg) scale(0.82)`;
    opacity = 0.5;
  } else if (distance === 2) {
    transform = `translateX(calc(-50% + ${side * 92}%)) translateZ(-90px) rotateY(${side * -70}deg) scale(0.65)`;
    opacity = 0.25;
  } else {
    transform = `translateX(calc(-50% + ${side * 120}%)) translateZ(-120px) rotateY(${side * -70}deg) scale(0.5)`;
    opacity = 0;
  }

  return {
    transform,
    opacity,
    zIndex: 30 - distance * 10,
    transition: `all 0.7s ${EASE}`,
    // El card que entra llega 0.05s después: cambio escalonado.
    transitionDelay: isEntering ? "0.05s" : "0s",
  };
}

function ProductCard({
  product,
  isActive,
  pulse,
}: {
  product: Product;
  isActive: boolean;
  pulse: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[20px] border bg-surface ${
        pulse ? "card-pulse" : ""
      } ${isActive ? "border-gold/40" : "border-cream/8"}`}
      style={{
        transition: `box-shadow 0.7s ${EASE}, border-color 0.7s ${EASE}`,
        boxShadow: isActive ? "0 30px 80px rgba(200, 151, 74, 0.15)" : "none",
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 640px) 420px, 80vw"
          draggable={false}
          className={`object-cover transition-transform duration-700 ease-out ${
            isActive ? "scale-105" : "scale-100"
          }`}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-surface/85 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Info visible solo en el card central */}
      <div
        className={`p-6 transition-opacity duration-500 sm:p-7 ${
          isActive ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isActive}
      >
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

        <h3 className="mt-4 font-display text-2xl font-semibold text-cream md:text-3xl">
          {product.name}
        </h3>
        <p className="mt-2 text-sm leading-6 text-cream/55">
          {product.description}
        </p>
        <p className="mt-4 font-display text-3xl font-semibold text-gold md:text-4xl">
          {product.price}
        </p>

        <a
          href={generateWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={isActive ? 0 : -1}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-gold/45 px-6 text-sm font-medium uppercase tracking-[0.16em] text-gold transition-all duration-300 hover:bg-gold hover:text-background"
        >
          Pedir por WhatsApp
        </a>
      </div>
    </div>
  );
}

export function Products() {
  const [active, setActive] = useState(0);
  const [hasNavigated, setHasNavigated] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const wheelLockRef = useRef(false);
  const touchStartX = useRef<number | null>(null);

  const total = products.length;

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(total - 1, index));
      if (clamped === activeRef.current) return;
      setActive(clamped);
      setHasNavigated(true);
    },
    [total],
  );

  // Navegación por rueda: encaja card a card con debounce de 600ms.
  // En los extremos no se hace preventDefault y la página scrollea normal.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (event: WheelEvent) => {
      const direction = event.deltaY > 0 ? 1 : -1;
      const target = activeRef.current + direction;
      if (target < 0 || target >= total) return;
      event.preventDefault();
      if (wheelLockRef.current) return;
      wheelLockRef.current = true;
      goTo(target);
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, WHEEL_DEBOUNCE_MS);
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [goTo, total]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (delta <= -SWIPE_THRESHOLD) goTo(activeRef.current + 1);
    else if (delta >= SWIPE_THRESHOLD) goTo(activeRef.current - 1);
  };

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

        <Reveal delay={220}>
          <div
            ref={stageRef}
            role="group"
            aria-roledescription="carrusel"
            aria-label="Carrusel de productos"
            className="relative mx-auto w-full max-w-4xl"
            style={{ perspective: "1200px" }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Resplandor radial detrás del card activo */}
            <div
              key={`glow-${active}`}
              aria-hidden="true"
              className="glow-breathe pointer-events-none absolute -inset-x-20 -inset-y-10"
              style={{
                background:
                  "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(200,151,74,0.04), transparent)",
              }}
            />

            {/* Card fantasma en flujo normal: fija la altura del escenario */}
            <div
              className="invisible mx-auto w-[min(80vw,420px)]"
              aria-hidden="true"
            >
              <ProductCard product={products[0]} isActive pulse={false} />
            </div>

            {products.map((product, index) => {
              const offset = index - active;
              const isActive = offset === 0;
              return (
                <div
                  key={product.id}
                  onClick={() => !isActive && goTo(index)}
                  style={coverflowStyle(offset, isActive)}
                  className={`absolute left-1/2 top-0 w-[min(80vw,420px)] ${
                    isActive ? "" : "cursor-pointer"
                  }`}
                >
                  <ProductCard
                    product={product}
                    isActive={isActive}
                    pulse={isActive && hasNavigated}
                  />
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-10 flex flex-col items-center gap-2">
            <p className="text-sm tracking-[0.2em] text-cream/50">
              {active + 1} / {total}
            </p>
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-cream/35">
              Scroll o desliza para explorar
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
