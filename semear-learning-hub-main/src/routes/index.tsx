import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, BookOpen, Users, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import hero from "@/assets/hero-students.jpg";
import pedagogia from "@/assets/curso-pedagogia.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Instituto Educacional Semear — Transformando vidas pela educação" },
      { name: "description", content: "O IES é uma instituição dedicada à formação de educadores e profissionais comprometidos com a transformação social. Conheça nossos cursos." },
      { property: "og:title", content: "Instituto Educacional Semear" },
      { property: "og:description", content: "Transformando vidas através da educação. Conheça o curso de Pedagogia do IES." },
      { property: "og:url", content: "/" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_40%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Ambiente Virtual de Aprendizagem
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
              Transformando vidas <br /> através da <span className="text-brand-light">educação</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              O Instituto Educacional Semear forma educadores preparados para mudar realidades.
              Estude com qualidade, flexibilidade e acompanhamento personalizado.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/area-aluno"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand shadow-lg transition hover:scale-[1.02]"
              >
                Inscreva-se <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/cursos"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Conheça nossos cursos
              </Link>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-6 text-center">
              {[
                { n: "+500", l: "Alunos" },
                { n: "100%", l: "Online" },
                { n: "+10", l: "Anos" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-bold text-brand-light">{s.n}</div>
                  <div className="text-xs text-white/70">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-brand-light/30 blur-3xl" />
            <img
              src={hero}
              alt="Estudantes do Instituto Educacional Semear"
              width={1600}
              height={1200}
              className="relative rounded-3xl shadow-brand"
            />
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: GraduationCap, t: "Ensino de qualidade", d: "Corpo docente qualificado e metodologia voltada à prática educacional." },
            { icon: BookOpen, t: "Material completo", d: "Acesso a apostilas, vídeos e biblioteca digital em um único ambiente." },
            { icon: Users, t: "Acompanhamento próximo", d: "Suporte pedagógico personalizado durante toda a sua jornada." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-7 shadow-card transition hover:-translate-y-1 hover:shadow-brand">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-foreground">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CURSOS */}
      <section id="cursos" className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-light">Cursos</span>
              <h2 className="mt-1 text-3xl font-bold text-brand md:text-4xl">Nossos cursos</h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Começamos com Pedagogia e nos preparamos para expandir nossa grade.
              </p>
            </div>
            <Link to="/cursos" className="text-sm font-semibold text-brand hover:underline">
              Ver todos →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <article className="group overflow-hidden rounded-2xl bg-card shadow-card transition hover:-translate-y-1 hover:shadow-brand">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={pedagogia} alt="Curso de Pedagogia" width={1200} height={900} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <span className="rounded-full bg-brand-light/15 px-3 py-1 text-xs font-semibold text-brand">Graduação</span>
                <h3 className="mt-3 text-xl font-bold text-foreground">Pedagogia</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Forme-se educador(a) com base sólida em didática, psicologia da educação e práticas pedagógicas.
                </p>
                <ul className="mt-4 space-y-1.5 text-sm text-foreground/80">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-light" /> Modalidade EaD</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-light" /> Duração de 4 anos</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-light" /> Estágio supervisionado</li>
                </ul>
                <Link to="/cursos" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:gap-2">
                  Saiba mais <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>

            {[1, 2].map((i) => (
              <article key={i} className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 p-10 text-center">
                <div className="rounded-full bg-secondary p-4">
                  <Sparkles className="h-6 w-6 text-brand-light" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">Em breve</h3>
                <p className="mt-1 text-sm text-muted-foreground">Novos cursos estão chegando à grade do IES.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* INSTITUCIONAL */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-light">Sobre o IES</span>
            <h2 className="mt-1 text-3xl font-bold text-brand md:text-4xl">
              Uma instituição que semeia conhecimento e colhe transformação
            </h2>
            <p className="mt-4 text-muted-foreground">
              O Instituto Educacional Semear nasceu com a missão de formar educadores e
              profissionais conscientes do seu papel social. Acreditamos que a educação é
              a ferramenta mais poderosa para transformar realidades.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Missão: promover educação acessível, ética e de qualidade.",
                "Visão: ser referência em formação de educadores no país.",
                "Valores: respeito, inclusão, excelência e compromisso social.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-light" />
                  <span className="text-foreground/85">{t}</span>
                </li>
              ))}
            </ul>
            <Link to="/sobre" className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-brand hover:opacity-90">
              Saiba mais sobre nós <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { n: "+500", l: "Alunos matriculados" },
              { n: "+30", l: "Professores" },
              { n: "+10", l: "Anos de história" },
              { n: "98%", l: "Satisfação dos alunos" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-gradient-brand p-6 text-brand-foreground shadow-card">
                <div className="text-3xl font-extrabold">{s.n}</div>
                <div className="mt-1 text-sm text-white/85">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-hero p-10 text-center text-white shadow-brand md:p-16">
          <h2 className="text-3xl font-bold md:text-4xl">Pronto para começar sua jornada?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Inscreva-se hoje no Instituto Educacional Semear e dê o próximo passo na sua carreira.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/area-aluno" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand shadow-lg hover:scale-[1.02]">
              Quero me inscrever
            </Link>
            <Link to="/contato" className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20">
              Falar com a secretaria
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
