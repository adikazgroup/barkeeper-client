import type { Metadata } from "next";
import {
  Categories,
  Faq,
  Hero,
  HowItWorks,
  PopularDishes,
  Promotions,
  ServiceStrip,
  Testimonials,
} from "./_components/home";

export const metadata: Metadata = {
  title: "Barkeeper’s Bar & Grill | Hill East, Washington DC",
  description:
    "Discover Barkeeper’s Bar & Grill in Hill East, Washington DC—signature drinks, crave-worthy food and memorable nights with friends.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <ServiceStrip />
      <Promotions />
      <Categories
        heading
        title="The Category"
        blurb="Every heading the kitchen prints, in the order it prints them."
      />
      <PopularDishes />
      <HowItWorks />
      <Testimonials />
      <Faq />
    </main>
  );
}
