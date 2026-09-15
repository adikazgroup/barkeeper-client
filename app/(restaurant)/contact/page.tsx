import type { Metadata } from "next";

import { cn } from "@/lib/utils";
import { Reveal } from "../_components/home/Reveal";
import { ContactHero } from "./_components/ContactHero";
import { ContactCards } from "./_components/ContactCards";
import { ContactForm } from "./_components/ContactForm";
import { Faq } from "../_components/home";

export const metadata: Metadata = {
  title: "Contact Barkeeper’s | Get in touch today",
  description:
    "Have a question or a craving? Contact Barkeeper’s for hours, location and support. Call, message or visit us — we’d love to hear from you.",
};

/** Horizontal padding lives on each row so the rules can reach the frame. */
const CELL = "px-5 sm:px-8";

export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <section
        aria-labelledby="reach-heading"
      >
        <div className="mx-auto max-w-7xl">
          <div className="border-x border-border/50">
            <h2 id="reach-heading" className="sr-only">
              Ways to reach us
            </h2>

            <Reveal
              className={cn(
                "grid gap-5 py-12 lg:grid-cols-12 lg:gap-6 sm:px-8 px-5 ",
                CELL,
              )}
            >
              <div className="lg:col-span-5">
                <ContactCards />
              </div>
              <div className="lg:col-span-7">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      <Faq />
    </>
  );
}
