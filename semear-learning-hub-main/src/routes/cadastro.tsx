import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useState, useEffect } from "react";
import { GraduationCap, User, Mail, Lock, IdCard, Phone, CheckCircle2 } from "lucide-react";
import { store } from "@/lib/ies-store";
import { z } from "zod";

const cadastroSearchSchema = z.object({
  curso: z.string().optional(),
});

export const Route = createFileRoute("/cadastro")({
  validateSearch: (search) => cadastroSearchSchema.parse(search),
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

const CURSOS_TECNICOS = [
  "Técnico em Administração",
  "Técnico em Farmácia",
  "Técnico em Estética",
];

function Cadastro() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const preselected = search.curso;

  const turmas = store.getTurmas();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [selectedChoice, setSelectedChoice] = useState<string>(() => {
    if (preselected) {
      if (CURSOS_TECNICOS.includes(preselected)) {
        return preselected;
      }
      const t = turmas.find((x) => x.id === preselected || x.nome === preselected || x.curso === preselected);
      if (t) return t.id;
    }
    return "";
  });

  const [periodo, setPeriodo] = useState<string>("1º Período");

  const isChoiceTecnico = CURSOS_TECNICOS.includes(selectedChoice);
  const isPedagogia = selectedChoice && !isChoiceTecnico;

  const periodosDisponiveis = isPedagogia
    ? ["1º Período", "2º Período", "3º Período", "4º Período", "5º Período", "6º Período", "7º Período", "8º Período"]
    : isChoiceTecnico
    ? ["1º Período", "2º Período", "3º Período", "4º Período"]
    : [];

  useEffect(() => {
    if (periodosDisponiveis.length > 0 && !periodosDisponiveis.includes(periodo)) {
      setPeriodo("1º Período");
    }
  }, [selectedChoice, periodosDisponiveis, periodo]);

  const [sucesso, setSucesso] = useState(false);
  const [sucessoMsg, setSucessoMsg] = useState("");
  const [sucessoSub, setSucessoSub] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedChoice) return;

    const isTecnico = CURSOS_TECNICOS.includes(selectedChoice);
    if (isTecnico) {
      store.addPreMatricula({
        id: `pre-${Date.now()}`,
        nome,
        email,
        telefone,
        curso: selectedChoice,
        dataInscricao: new Date().toISOString(),
        status: "Pré-Matriculado",
        periodo,
      });
      setSucessoMsg("Pré-matrícula realizada!");
      setSucessoSub(`Você foi cadastrado com sucesso na lista de espera do curso ${selectedChoice} no ${periodo}. Entraremos em contato assim que novas turmas forem abertas.`);
      setSucesso(true);
      setTimeout(() => navigate({ to: "/" }), 3000);
    } else {
      const turmaSel = turmas.find((t) => t.id === selectedChoice)!;
      if (typeof window !== "undefined") {
        store.setAluno({
          nome,
          email,
          curso: turmaSel.curso,
          turmaId: turmaSel.id,
          turmaNome: turmaSel.nome,
          periodo,
        });
      }
      setSucessoMsg("Matrícula realizada!");
      setSucessoSub("Redirecionando para seu painel de aluno...");
      setSucesso(true);
      setTimeout(() => navigate({ to: "/aluno/dashboard" }), 1500);
    }
  }

  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-14 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h1 className="text-3xl font-extrabold md:text-4xl">Cadastro do Aluno</h1>
          <p className="mt-3 text-white/85">Preencha seus dados e escolha seu curso ou turma de interesse para concluir.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        {sucesso ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-light/15 text-brand">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-foreground">{sucessoMsg}</h2>
            <p className="mt-2 text-muted-foreground">{sucessoSub}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <Field icon={User} label="Nome completo" required>
                <input required value={nome} onChange={(e) => setNome(e.target.value)} className={inputCls} placeholder="Seu nome completo" />
              </Field>
              <Field icon={IdCard} label="CPF" required>
                <input required value={cpf} onChange={(e) => setCpf(e.target.value)} className={inputCls} placeholder="000.000.000-00" />
              </Field>
              <Field icon={Mail} label="E-mail" required>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="voce@email.com" />
              </Field>
              <Field icon={Phone} label="Telefone / WhatsApp" required>
                <input required value={telefone} onChange={(e) => setTelefone(e.target.value)} className={inputCls} placeholder="(00) 00000-0000" />
              </Field>
              <Field icon={Lock} label="Senha" required>
                <input required type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className={inputCls} placeholder="Mínimo 8 caracteres" />
              </Field>
              <Field icon={Lock} label="Confirmar senha" required>
                <input required type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className={inputCls} placeholder="Repita a senha" />
              </Field>
            </div>

            <div>
              <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <GraduationCap className="h-4 w-4 text-brand" />
                Selecione o Curso ou Turma de interesse <span className="text-destructive">*</span>
              </label>

              {/* Cursos Técnicos (Pré-Matrícula) */}
              <div className="mb-6">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-light">Cursos Técnicos (Pré-Matrícula / Lista de Espera)</h3>
                <div className="grid gap-3 md:grid-cols-3">
                  {CURSOS_TECNICOS.map((curso) => {
                    const ativo = selectedChoice === curso;
                    return (
                      <label
                        key={curso}
                        className={`cursor-pointer rounded-xl border-2 p-4 text-sm transition block ${
                          ativo ? "border-brand bg-brand/5 shadow-brand/30" : "border-border bg-background hover:border-brand-light"
                        }`}
                      >
                        <input
                          type="radio"
                          name="curso_escolha"
                          value={curso}
                          checked={ativo}
                          onChange={() => setSelectedChoice(curso)}
                          className="sr-only"
                        />
                        <div className="text-xs font-semibold uppercase text-brand-light">Técnico</div>
                        <div className="mt-1 text-base font-bold text-foreground">{curso}</div>
                        <div className="mt-1 text-xs text-muted-foreground font-medium text-amber-500">
                          Sem turma aberta (Fila de espera)
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Graduação (Turmas Abertas) */}
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-light">Graduação (Turmas Ativas)</h3>
                <div className="grid gap-3 md:grid-cols-3">
                  {turmas
                    .filter((t) => t.curso === "Pedagogia")
                    .map((t) => {
                      const ativo = selectedChoice === t.id;
                      return (
                        <label
                          key={t.id}
                          className={`cursor-pointer rounded-xl border-2 p-4 text-sm transition block ${
                            ativo ? "border-brand bg-brand/5 shadow-brand/30" : "border-border bg-background hover:border-brand-light"
                          }`}
                        >
                          <input
                            type="radio"
                            name="curso_escolha"
                            value={t.id}
                            checked={ativo}
                            onChange={() => setSelectedChoice(t.id)}
                            className="sr-only"
                          />
                          <div className="text-xs font-semibold uppercase text-brand-light">{t.curso}</div>
                          <div className="mt-1 text-base font-bold text-foreground">{t.nome}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {t.ano} · {t.semestre}º semestre
                          </div>
                        </label>
                      );
                    })}
                </div>
              </div>
              {!selectedChoice && <p className="mt-2 text-xs text-muted-foreground">Selecione uma opção para continuar.</p>}

              {selectedChoice && periodosDisponiveis.length > 0 && (
                <div className="mt-6">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <GraduationCap className="h-4 w-4 text-brand" />
                    Período Atual <span className="text-destructive">*</span>
                  </label>
                  <select
                    required
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background p-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    {periodosDisponiveis.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
                disabled={!selectedChoice || !nome}
                className="rounded-full bg-gradient-brand px-8 py-3 text-sm font-semibold text-brand-foreground shadow-brand transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {CURSOS_TECNICOS.includes(selectedChoice) ? "Solicitar Pré-Matrícula" : "Concluir matrícula"}
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
