import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Target, Eye, Heart } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o IES — Instituto Educacional Semear" },
      { name: "description", content: "Conheça a história, missão, visão e valores do Instituto Educacional Semear." },
      { property: "og:title", content: "Sobre o IES" },
      { property: "og:description", content: "Nossa missão é transformar vidas pela educação." },
      { property: "og:url", content: "/sobre" },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-light">Sobre nós</span>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Instituto Educacional Semear</h1>
          <p className="mt-4 text-lg text-white/85">
            Uma instituição comprometida em formar educadores e profissionais que transformam o mundo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <div className="prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-brand">Nossa história</h2>
          <p className="text-muted-foreground">
            O Instituto Educacional Semear (IES) foi fundado com o propósito de oferecer
            educação de qualidade, acessível e transformadora. Ao longo dos anos, formamos
            centenas de educadores que hoje atuam em escolas, projetos sociais e instituições
            de ensino por todo o país.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Target, t: "Missão", d: "Promover educação ética, acessível e de excelência, formando cidadãos transformadores." },
            { icon: Eye, t: "Visão", d: "Ser referência nacional em formação de educadores e profissionais da educação." },
            { icon: Heart, t: "Valores", d: "Respeito, inclusão, ética, excelência e compromisso social." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-7 shadow-card">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
