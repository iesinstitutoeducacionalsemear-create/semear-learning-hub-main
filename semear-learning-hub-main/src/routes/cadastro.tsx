import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useState } from "react";
import { GraduationCap, User, Mail, Lock, IdCard, Phone, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Cadastro de Aluno — IES" },
      { name: "description", content: "Matricule-se em uma turma do Instituto Educacional Semear." },
      { property: "og:title", content: "Cadastro de Aluno — IES" },
      { property: "og:description", content: "Crie sua conta e escolha sua turma." },
    ],
  }),
  component: Cadastro,
});

// Mockup — em produção virá do banco de dados (tabela "turmas")
const TURMAS_MOCK = [
  { id: "ped-2024-2", curso: "Pedagogia", nome: "Pedagogia 2024.2", ano: 2024, semestre: 2 },
  { id: "ped-2025-1", curso: "Pedagogia", nome: "Pedagogia 2025.1", ano: 2025, semestre: 1 },
  { id: "ped-2026-1", curso: "Pedagogia", nome: "Pedagogia 2026.1", ano: 2026, semestre: 1 },
];

function Cadastro() {
  const navigate = useNavigate();
  const [turma, setTurma] = useState<string>("");
  const [nome, setNome] = useState("");
  const [sucesso, setSucesso] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!turma) return;
    const turmaSel = TURMAS_MOCK.find((t) => t.id === turma)!;
    // Mockup: persiste em localStorage só para demonstrar o fluxo do dashboard
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "ies_aluno_demo",
        JSON.stringify({ nome, curso: turmaSel.curso, turmaId: turmaSel.id, turmaNome: turmaSel.nome }),
      );
    }
    setSucesso(true);
    setTimeout(() => navigate({ to: "/aluno/dashboard" }), 1200);
  }

  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-14 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h1 className="text-3xl font-extrabold md:text-4xl">Cadastro do Aluno</h1>
          <p className="mt-3 text-white/85">Preencha seus dados e escolha sua turma para concluir a matrícula.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        {sucesso ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-light/15 text-brand">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-foreground">Matrícula realizada!</h2>
            <p className="mt-2 text-muted-foreground">Redirecionando para seu painel…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <Field icon={User} label="Nome completo" required>
                <input required value={nome} onChange={(e) => setNome(e.target.value)} className={inputCls} placeholder="Seu nome completo" />
              </Field>
              <Field icon={IdCard} label="CPF" required>
                <input required className={inputCls} placeholder="000.000.000-00" />
              </Field>
              <Field icon={Mail} label="E-mail" required>
                <input required type="email" className={inputCls} placeholder="voce@email.com" />
              </Field>
              <Field icon={Phone} label="Telefone / WhatsApp" required>
                <input required className={inputCls} placeholder="(00) 00000-0000" />
              </Field>
              <Field icon={Lock} label="Senha" required>
                <input required type="password" className={inputCls} placeholder="Mínimo 8 caracteres" />
              </Field>
              <Field icon={Lock} label="Confirmar senha" required>
                <input required type="password" className={inputCls} placeholder="Repita a senha" />
              </Field>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <GraduationCap className="h-4 w-4 text-brand" />
                Turma <span className="text-destructive">*</span>
              </label>
              <div className="grid gap-3 md:grid-cols-3">
                {TURMAS_MOCK.map((t) => {
                  const ativo = turma === t.id;
                  return (
                    <label
                      key={t.id}
                      className={`cursor-pointer rounded-xl border-2 p-4 text-sm transition ${
                        ativo ? "border-brand bg-brand/5 shadow-brand/30" : "border-border bg-background hover:border-brand-light"
                      }`}
                    >
                      <input type="radio" name="turma" value={t.id} checked={ativo} onChange={() => setTurma(t.id)} className="sr-only" />
                      <div className="text-xs font-semibold uppercase text-brand-light">{t.curso}</div>
                      <div className="mt-1 text-base font-bold text-foreground">{t.nome}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {t.ano} · {t.semestre}º semestre
                      </div>
                    </label>
                  );
                })}
              </div>
              {!turma && <p className="mt-2 text-xs text-muted-foreground">Selecione a turma em que deseja se matricular.</p>}
            </div>

            <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-6 md:flex-row">
              <p className="text-xs text-muted-foreground">
                Já tem cadastro?{" "}
                <Link to="/area-aluno" className="font-semibold text-brand hover:underline">
                  Acessar minha conta
                </Link>
              </p>
              <button
                type="submit"
                disabled={!turma || !nome}
                className="rounded-full bg-gradient-brand px-8 py-3 text-sm font-semibold text-brand-foreground shadow-brand transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Concluir matrícula
              </button>
            </div>
          </form>
        )}
      </section>
    </SiteLayout>
  );
}

const inputCls =
  "w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function Field({
  icon: Icon,
  label,
  required,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {children}
      </div>
    </label>
  );
}
