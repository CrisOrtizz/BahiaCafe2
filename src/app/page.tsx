import { CTA } from "@/components/sections/CTA";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Origin } from "@/components/sections/Origin";
import { Products } from "@/components/sections/Products";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Origin />
      <Experience />
      <Products />
      <CTA />
    </>
  );
}
