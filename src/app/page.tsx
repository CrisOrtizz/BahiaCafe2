import { CTA } from "@/components/sections/CTA";
import { Combos } from "@/components/sections/Combos";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Origin } from "@/components/sections/Origin";
import { Preparation } from "@/components/sections/Preparation";
import { Products } from "@/components/sections/Products";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CustomCursor } from "@/components/ui/CustomCursor";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Manifesto />
        <Origin />
        <Products />
        <Combos />
        <Preparation />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
