import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { generateWhatsAppLink } from "@/lib/whatsapp";

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

export function Combos() {
  return (
    <section className="relative bg-background pb-20 md:pb-32">
      <Container>
        <div className="gold-divider mb-20 md:mb-28" aria-hidden="true" />

        <div className="mb-14 max-w-3xl md:mb-16">
          <Reveal as="p">
            <span className="block text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              Combos
            </span>
          </Reveal>
          <Reveal as="h2" delay={120}>
            <span className="heading-section mt-6 block leading-[1.12] text-cream">
              Selecciones para cada ritual.
            </span>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-10">
          {combos.map((combo, index) => (
            <Reveal key={combo.title} as="article" delay={index * 130}>
              <div className="group overflow-hidden rounded-2xl border border-cream/8 bg-surface transition-all duration-500 hover:scale-[1.03] hover:border-gold/60 hover:shadow-[0_24px_70px_-18px_rgba(200,151,74,0.28)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={comboImage}
                    alt={combo.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-surface/85 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                </div>

                <div className="p-7">
                  <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-gold/80">
                    {combo.note}
                  </p>
                  <h3 className="mt-3 font-display text-2xl text-cream">
                    {combo.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-cream/55">
                    {combo.description}
                  </p>
                  <a
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold transition-colors duration-300 hover:text-cream"
                  >
                    Pedir por WhatsApp
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
