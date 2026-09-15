import type { Metadata } from "next";
import {
  Categories,
  Faq,
  Hero,
  PopularDishes,
  Promotions,
  ServiceStrip,
  Testimonials,
} from "./_components/home";

export const metadata: Metadata = {
  title: "Barkeeper — Every message answered, every order captured",
  description:
    "One AI agent answers your Instagram, Facebook, Messenger and WhatsApp conversations in your own voice, confirms the sale, and writes the order into your store.",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <ServiceStrip />
      <Promotions />
      <Categories
        part="first"
        heading
        title="The board"
        blurb="Every heading the kitchen prints, in the order it prints them."
      />
      <PopularDishes />
      <Testimonials />
      <Categories
        part="second"
        reverse
        title="Keep looking"
        blurb="The rest of the board, from the sides to the sweet end."
      />
      <Faq />
    </main>
  );
}
