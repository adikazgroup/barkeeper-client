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
      <Categories group="kitchen" heading />
      <PopularDishes />
      <Testimonials />
      <Categories group="bar" reverse />
      <Faq />

    </main>


  );
}
