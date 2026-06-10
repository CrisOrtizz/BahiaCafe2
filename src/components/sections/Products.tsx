import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { products } from "@/data/products";
import { generateWhatsAppLink } from "@/lib/whatsapp";

const sectionCopy = {
  label: "Productos",
  title: "Cafés para beber con calma.",
};

export function Products() {
  return (
    <section id="products" className="relative bg-background py-20 md:py-32">
      <Container>
        <div className="mb-14 max-w-3xl md:mb-20">
          <Reveal as="p">
            <span className="block text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              {sectionCopy.label}
            </span>
          </Reveal>
          <Reveal as="h2" delay={120}>
            <span className="mt-6 block font-serif text-5xl leading-[1.05] text-cream md:text-6xl lg:text-7xl">
              {sectionCopy.title}
            </span>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-12 lg:gap-16">
          {products.map((product, index) => (
            <Reveal key={product.id} as="article" delay={index * 140}>
              <div className="group overflow-hidden rounded-2xl border border-cream/8 bg-surface transition-all duration-500 hover:scale-[1.03] hover:border-gold/60 hover:shadow-[0_24px_70px_-18px_rgba(200,151,74,0.28)]">
                <div className="relative aspect-[5/4] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-surface/85 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                </div>

                <div className="p-7 md:p-8">
                  {/* Notas de sabor como tags */}
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

                  <h3 className="mt-5 font-serif text-2xl text-cream md:text-3xl">
                    {product.name}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-cream/55 md:text-base">
                    {product.description}
                  </p>
                  <p className="mt-5 font-serif text-2xl text-gold md:text-3xl">
                    {product.price}
                  </p>

                  <a
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-gold/45 px-6 text-sm font-medium uppercase tracking-[0.16em] text-gold transition-all duration-300 hover:bg-gold hover:text-background sm:w-auto"
                  >
                    Pedir por WhatsApp
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
