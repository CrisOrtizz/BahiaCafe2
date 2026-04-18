import { CTA } from "@/components/sections/CTA";
import { Combos } from "@/components/sections/Combos";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Origin } from "@/components/sections/Origin";
import { Preparation } from "@/components/sections/Preparation";
import { Products } from "@/components/sections/Products";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Origin />
      <Products />
      <Combos />
      <Preparation />
      <CTA />
    </>
  );
}
