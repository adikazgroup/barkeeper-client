"use client";

/**
 * The message form.
 *
 * No card of its own any more: the page rules this column off from the ways in
 * beside it, and a bordered box inside a ruled column is a frame within a
 * frame. The fields are left to the shared `Input` and `Textarea` — those
 * already speak in the semantic tokens, so the page needs no overrides.
 */

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input/Input";
import { Textarea } from "@/components/ui/textarea/Textarea";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error || "Failed to send");
        return;
      }

      toast.success("Message sent — we’ll be in touch");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Could not reach the kitchen. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="message"
      className="h-full scroll-mt-24 rounded-2xl border border-border/60 bg-card/30 p-6 sm:p-9"
    >
      <div className="mb-8">
        <h2 className="text-[26px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[34px]">
          Send word
        </h2>
        <p className="mt-3 max-w-[46ch] text-[14px] leading-[1.7] text-muted-foreground">
          Tell us what you need. We usually reply the same day.
        </p>
      </div>

      <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            label="Your name"
            onChange={handleChange}
            value={formData.name}
            className="bg-transparent"
          />
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            label="Email address"
            onChange={handleChange}
            value={formData.email}
            className="bg-transparent"
          />
        </div>

        <Input
          type="text"
          id="phone"
          name="phone"
          placeholder="So we can ring you back"
          label="Phone number"
          onChange={handleChange}
          value={formData.phone}
          className="bg-transparent"
        />

        <Textarea
          id="message-body"
          name="message"
          placeholder="A table for six on Sunday, wings for the office, or a word about your last order…"
          label="Message"
          rows={6}
          onChange={handleChange}
          value={formData.message}
          className="bg-transparent"
        />

        {/* The note that stood here now heads the column beside this one, so
            the row closes on the button alone. */}
        <div className="flex flex-col items-start gap-5 pt-2 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="group inline-flex h-11 w-full shrink-0 items-center justify-between gap-4 rounded-full bg-primary py-1 pr-1 pl-5 text-[14px] font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
          >
            {loading ? "Sending…" : "Send message"}
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
              <Send aria-hidden className="size-4" />
            </span>
          </button>

          <p className="text-[12.5px] leading-[1.7] text-muted-foreground">
            We usually reply the same day.
          </p>
        </div>
      </form>
    </div>
  );
}
