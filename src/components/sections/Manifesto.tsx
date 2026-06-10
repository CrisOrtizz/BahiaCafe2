import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const manifestoLines = [
  { text: "No es solo café.", accent: false },
  { text: "Es origen, proceso y cultura.", accent: true },
  { text: "Desde las montañas de Tolima", accent: false },
  { text: "hasta las tazas en la costa.", accent: false },
];

const lineStyles = [
  "font-display text-5xl leading-[1.02] text-cream sm:text-6xl md:text-7xl lg:text-8xl",
  "heading-accent mt-4 font-display text-4xl leading-[1.06] sm:text-5xl md:text-6xl lg:text-7xl",
  "mt-12 text-2xl font-light leading-[1.25] text-cream/55 sm:text-3xl md:mt-14 md:text-4xl",
  "mt-3 text-2xl font-light leading-[1.25] text-cream/55 sm:text-3xl md:text-4xl",
];

export function Manifesto() {
  return (
    <section id="manifesto" className="relative bg-background py-20 md:py-32">
      <Container>
        <div className="max-w-4xl">
          {manifestoLines.map((line, index) => (
            <Reveal key={line.text} as="p" delay={index * 130}>
              <span
                className={`block ${lineStyles[index]} ${
                  line.accent ? "text-gold" : ""
                }`}
              >
                {line.text}
              </span>
            </Reveal>
          ))}
        </div>
        <Reveal delay={520}>
          <div className="gold-divider mt-20 md:mt-28" aria-hidden="true" />
        </Reveal>
      </Container>
    </section>
  );
}
