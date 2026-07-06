export const metadata = {
  title: "Home - Open PRO",
  description: "Page description",
};

import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/Hero-home/Hero";
import Testimonials from "@/components/testimonials";
import Features from "@/components/features";


export default function Home() {
  return (
    <>
      <PageIllustration />
      <Hero />
      <Features />
      <Testimonials />
    </>
  );
}
