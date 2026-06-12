import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Clock, Award, MonitorPlay, CheckCircle2, Sparkles } from "lucide-react";
import pedagogia from "@/assets/curso-pedagogia.jpg";

export const Route = createFileRoute("/cursos")({
  head: () => ({
    meta: [
      { title: "Cursos — Instituto Educacional Semear" },
      { name: "description", content: "Conheça o curso de Pedagogia do IES e prepare-se para novos cursos que estão chegando." },
      { property: "og:title", content: "Cursos do IES" },
      { property: "og:description", content: "Graduação em Pedagogia e novos cursos em breve." },
      { property: "og:url", content: "/cursos" },
    ],
  }),
  component: Cursos,
});

function Cursos() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-light">Cursos</span>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Nossos cursos</h1>
          <p className="mt-4 text-lg text-white/85">
            Formação de qualidade pensada para transformar a sua carreira.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <article className="grid items-center gap-10 overflow-hidden rounded-3xl bg-card shadow-card md:grid-cols-2">
          <img src={pedagogia} alt="Curso de Pedagogia do IES" width={1200} height={900} className="h-full w-full object-cover" loading="lazy" />
          <div className="p-8 md:p-10">
            <span className="rounded-full bg-brand-light/15 px-3 py-1 text-xs font-semibold text-brand">Graduação · Em destaque</span>
            <h2 className="mt-3 text-3xl font-bold text-brand">Pedagogia</h2>
            <p className="mt-3 text-muted-foreground">
              Forme-se educador(a) preparado(a) para atuar na Educação Infantil, Anos Iniciais
              do Ensino Fundamental, gestão escolar e ambientes não-escolares.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl bg-secondary p-3 text-center">
                <Clock className="mx-auto h-5 w-5 text-brand" />
                <div className="mt-1 font-semibold text-foreground">4 anos</div>
              </div>
              <div className="rounded-xl bg-secondary p-3 text-center">
                <MonitorPlay className="mx-auto h-5 w-5 text-brand" />
                <div className="mt-1 font-semibold text-foreground">EaD</div>
              </div>
              <div className="rounded-xl bg-secondary p-3 text-center">
                <Award className="mx-auto h-5 w-5 text-brand" />
                <div className="mt-1 font-semibold text-foreground">Licenciatura</div>
              </div>
            </div>

            <ul className="mt-6 space-y-2 text-sm">
              {["Didática e Metodologias de Ensino", "Psicologia da Educação", "Gestão Escolar", "Educação Inclusiva", "Estágio Supervisionado"].map((d) => (
                <li key={d} className="flex items-center gap-2 text-foreground/85">
                  <CheckCircle2 className="h-4 w-4 text-brand-light" /> {d}
                </li>
              ))}
            </ul>

            <Link to="/area-aluno" className="mt-7 inline-flex rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-brand hover:opacity-90">
              Quero me inscrever
            </Link>
          </div>
        </article>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {["Letras", "História", "Administração Escolar"].map((c) => (
            <div key={c} className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 p-10 text-center">
              <div className="rounded-full bg-secondary p-4">
                <Sparkles className="h-6 w-6 text-brand-light" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">{c}</h3>
              <p className="mt-1 text-sm text-muted-foreground">Em breve no IES</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
