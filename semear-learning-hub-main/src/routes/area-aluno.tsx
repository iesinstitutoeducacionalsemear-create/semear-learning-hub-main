import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Lock, User } from "lucide-react";
import { store } from "@/lib/ies-store";

export const Route = createFileRoute("/area-aluno")({
  head: () => ({
    meta: [
      { title: "Área do Aluno — IES" },
      { name: "description", content: "Acesse o ambiente virtual de aprendizagem do Instituto Educacional Semear." },
      { property: "og:title", content: "Área do Aluno — IES" },
      { property: "og:description", content: "Portal de acesso para alunos do IES." },
      { property: "og:url", content: "/area-aluno" },
    ],
  }),
  component: AreaAluno,
});

function AreaAluno() {
  const navigate = useNavigate();
  function entrar(e: React.FormEvent) {
    e.preventDefault();
    let aluno = store.getAluno();
    if (!aluno) {
      aluno = store.alunoPadrao();
      store.setAluno(aluno);
    }
    navigate({ to: "/aluno/dashboard" });
  }
  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h1 className="text-3xl font-extrabold md:text-4xl">Área do Aluno</h1>
          <p className="mt-3 text-white/85">Acesse o ambiente virtual de aprendizagem do IES.</p>
        </div>
      </section>

      <section className="mx-auto max-w-md px-4 py-16 md:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-brand-foreground">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-center text-xl font-bold text-foreground">Entrar como aluno</h2>
          <form className="mt-6 space-y-4" onSubmit={entrar}>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="CPF ou e-mail" className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="password" placeholder="Senha" className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button className="w-full rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-brand hover:opacity-90">
              Acessar Área do Aluno
            </button>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <a href="#" className="hover:text-brand">Esqueci minha senha</a>
              <Link to="/contato" className="hover:text-brand">Preciso de ajuda</Link>
            </div>
          </form>

          <p className="mt-6 rounded-lg bg-secondary p-3 text-center text-xs text-muted-foreground">
            Ainda não tem cadastro?{" "}
            <Link to="/cadastro" className="font-semibold text-brand hover:underline">Matricule-se agora</Link>
          </p>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Mockup: o login entra automaticamente com um aluno de demonstração.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
