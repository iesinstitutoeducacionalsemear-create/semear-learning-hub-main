import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Instituto Educacional Semear" },
      { name: "description", content: "Fale com o Instituto Educacional Semear. WhatsApp, e-mail e endereço." },
      { property: "og:title", content: "Contato — IES" },
      { property: "og:description", content: "Fale com a nossa secretaria." },
      { property: "og:url", content: "/contato" },
    ],
  }),
  component: Contato,
});

function Contato() {
  const [enviado, setEnviado] = useState(false);
  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-light">Contato</span>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Fale conosco</h1>
          <p className="mt-4 text-lg text-white/85">
            Tire suas dúvidas e saiba como se inscrever no IES.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 lg:grid-cols-2">
        <div className="space-y-4">
          {[
            { icon: MapPin, t: "Endereço", d: "Av. Principal, 1000 — Centro" },
            { icon: Phone, t: "Telefone", d: "(00) 0000-0000" },
            { icon: MessageCircle, t: "WhatsApp", d: "(00) 90000-0000", href: "https://wa.me/5500000000000" },
            { icon: Mail, t: "E-mail", d: "contato@iessemear.edu.br", href: "mailto:contato@iessemear.edu.br" },
          ].map(({ icon: Icon, t, d, href }) => (
            <a key={t} href={href ?? "#"} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-brand">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-light">{t}</div>
                <div className="truncate font-medium text-foreground">{d}</div>
              </div>
            </a>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setEnviado(true); }}
          className="rounded-2xl border border-border bg-card p-7 shadow-card"
        >
          <h2 className="text-xl font-bold text-brand">Envie uma mensagem</h2>
          <div className="mt-5 grid gap-4">
            <input required placeholder="Nome completo" className="rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <input required type="email" placeholder="E-mail" className="rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <input placeholder="Telefone" className="rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <textarea required rows={5} placeholder="Sua mensagem" className="rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <button className="rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-brand hover:opacity-90">
              Enviar mensagem
            </button>
            {enviado && <p className="text-sm font-medium text-brand-light">Mensagem enviada! Em breve entraremos em contato.</p>}
          </div>
        </form>
      </section>
    </SiteLayout>
  );
}
