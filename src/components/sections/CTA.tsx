import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-36">
      {/* Resplandor dorado sutil de fondo */}
      <div
        className="absolute left-1/2 top-1/2 h-[480px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(200,151,74,0.12),transparent_65%)]"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal as="p">
            <span className="block text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              Pedidos
            </span>
          </Reveal>
          <Reveal as="h2" delay={120}>
            <span className="heading-section mt-6 block leading-[1.15] text-cream">
              ¿Listo para probar café de origen?
            </span>
          </Reveal>
          <Reveal as="p" delay={220}>
            <span className="mt-6 block max-w-xl text-base leading-7 text-cream/55 md:text-lg">
              Escríbenos y te ayudamos a elegir la mejor opción para tu ritual
              de café.
            </span>
          </Reveal>
          <Reveal delay={320}>
            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex min-h-13 items-center justify-center rounded-full bg-gold px-9 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-background transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-12px_rgba(200,151,74,0.5)]"
            >
              Hablar por WhatsApp
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
