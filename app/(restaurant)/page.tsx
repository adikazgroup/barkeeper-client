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
  title: "Barkeeper’s — Irish Bar & Grill in Hill East, Washington DC",
  description:
    "Award-winning wings, smash burgers and rice bowls from the kitchen, whiskey, draught and cocktails from the bar. Order online for collection or book a table at Barkeeper’s.",
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
