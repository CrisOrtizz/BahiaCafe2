import { Container } from "@/components/ui/Container";
import { brand } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <Container className="py-8 text-sm text-gray-600">
        <p>
          {brand.name}. {brand.description}
        </p>
      </Container>
    </footer>
  );
}
