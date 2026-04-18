import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { brand, navigationLinks } from "@/data/site";

export function Navbar() {
  return (
    <header className="border-b border-gray-200">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="shrink-0 text-sm font-semibold">
          {brand.name}
        </Link>
        <nav
          aria-label="Navegacion principal"
          className="hidden gap-6 text-sm sm:flex"
        >
          {navigationLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-gray-700">
              {link.label}
            </a>
          ))}
        </nav>
      </Container>
    </header>
  );
}
