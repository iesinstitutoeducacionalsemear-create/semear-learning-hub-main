import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/professores")({
  head: () => ({
    meta: [
      { title: "Professores — Instituto Educacional Semear" },
      { name: "description", content: "Conheça o corpo docente do Instituto Educacional Semear." },
      { property: "og:title", content: "Corpo docente do IES" },
      { property: "og:description", content: "Conheça nossos professores." },
      { property: "og:url", content: "/professores" },
    ],
  }),
  component: Professores,
});

const docentes = [
  { nome: "Profa. Dra. Ana Carolina Lima", area: "Didática e Metodologia", form: "Doutora em Educação" },
  { nome: "Prof. Me. Ricardo Souza", area: "Psicologia da Educação", form: "Mestre em Psicologia" },
  { nome: "Profa. Esp. Marina Oliveira", area: "Educação Infantil", form: "Especialista em Pedagogia" },
  { nome: "Prof. Dr. João Pereira", area: "Gestão Escolar", form: "Doutor em Administração Escolar" },
  { nome: "Profa. Me. Camila Rocha", area: "Educação Inclusiva", form: "Mestra em Educação Especial" },
  { nome: "Prof. Esp. Felipe Andrade", area: "Estágio Supervisionado", form: "Especialista em Práticas Pedagógicas" },
];

function Professores() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-light">Corpo docente</span>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Nossos professores</h1>
          <p className="mt-4 text-lg text-white/85">
            Educadores qualificados e apaixonados pelo que fazem.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {docentes.map((d) => (
            <div key={d.nome} className="rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-brand">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand text-brand-foreground">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">{d.nome}</h3>
              <p className="text-sm font-medium text-brand-light">{d.area}</p>
              <p className="mt-1 text-sm text-muted-foreground">{d.form}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
