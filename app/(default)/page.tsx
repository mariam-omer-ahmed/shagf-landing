export const metadata = {
  title: "Home - Open PRO",
  description: "Page description",
};

import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/hero-home";
import Features from "@/components/features";
import Testimonials from "@/components/testimonials";
import Cta from "@/components/cta";
import Bousola from "@/components/Bousola";

export default function Home() {
  return (
    <>
      <PageIllustration />
      <Hero />
      <Features />
      <Testimonials />
      <Cta />
      <Bousola></Bousola>
    </>
  );
}
