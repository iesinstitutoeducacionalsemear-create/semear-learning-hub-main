import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PainelLayout } from "@/components/PainelLayout";
import { MENU_ALUNO } from "@/lib/menus";
import { store, type AlunoSession, type Atividade, type Entrega, type Turma, fmtData } from "@/lib/ies-store";
import { BookOpen, Bell, FileText, Award, Calendar, GraduationCap, Users } from "lucide-react";

export const Route = createFileRoute("/aluno/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard do Aluno — IES" },
      { name: "description", content: "Acompanhe sua turma, atividades e prazos no Instituto Educacional Semear." },
    ],
  }),
  component: AlunoDashboard,
});

const AVISOS_POR_TURMA: Record<string, { titulo: string; data: string }[]> = {
  "ped-2024-2": [{ titulo: "Reunião de orientação de TCC", data: "15/06" }],
  "ped-2025-1": [{ titulo: "Semana acadêmica IES", data: "24/06" }],
  "ped-2026-1": [
    { titulo: "Boas-vindas à turma 2026.1", data: "10/06" },
    { titulo: "Acesso à biblioteca digital liberado", data: "12/06" },
  ],
};

function AlunoDashboard() {
  const navigate = useNavigate();
  const [aluno, setAluno] = useState<AlunoSession | null>(null);
  const [turma, setTurma] = useState<Turma | null>(null);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [entregas, setEntregas] = useState<Entrega[]>([]);

  useEffect(() => {
    const a = store.getAluno();
    if (!a) return;
    setAluno(a);
    setTurma(store.getTurmas().find((t) => t.id === a.turmaId) ?? null);
    setAtividades(store.getAtividades().filter((x) => x.turmaId === a.turmaId));
    setEntregas(store.getEntregas().filter((x) => x.alunoEmail === a.email));
  }, []);

  const pendentes = useMemo(
    () => atividades.filter((a) => !entregas.find((e) => e.atividadeId === a.id)),
    [atividades, entregas],
  );

  const proximosPrazos = useMemo(
    () => [...atividades].sort((a, b) => a.prazo.localeCompare(b.prazo)).slice(0, 5),
    [atividades],
  );

  if (!aluno) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 text-center md:px-6">
        <h1 className="text-2xl font-bold text-foreground">Você ainda não está matriculado</h1>
        <p className="mt-2 text-muted-foreground">Conclua seu cadastro para acessar o painel do aluno.</p>
        <Link
          to="/cadastro"
          className="mt-6 inline-flex rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-brand hover:opacity-90"
        >
          Fazer cadastro
        </Link>
      </section>
    );
  }

  const avisos = AVISOS_POR_TURMA[aluno.turmaId] ?? [];
  const disciplinas = turma?.disciplinas ?? [];

  return (
    <PainelLayout
      perfil="aluno"
      titulo={aluno.nome}
      subtitulo={`${aluno.curso} · ${aluno.turmaNome}`}
      menu={MENU_ALUNO}
      onLogout={() => { store.logoutAluno(); navigate({ to: "/" }); }}
    >
      <section className="mb-8 rounded-2xl bg-gradient-hero p-6 text-white shadow-brand">
        <p className="text-sm text-white/80">Bem-vindo(a),</p>
        <h1 className="text-2xl font-extrabold md:text-3xl">{aluno.nome}</h1>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">
            <GraduationCap className="mr-1 inline h-4 w-4" /> Curso: <strong>{aluno.curso}</strong>
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">
            <Users className="mr-1 inline h-4 w-4" /> Turma: <strong>{aluno.turmaNome}</strong>
          </span>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={BookOpen} label="Disciplinas" value={disciplinas.length} />
        <Stat icon={FileText} label="Atividades pendentes" value={pendentes.length} />
        <Stat icon={Bell} label="Avisos" value={avisos.length} />
        <Stat icon={Award} label="Frequência" value="92%" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card title="Atividades pendentes" icon={FileText}>
          {pendentes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Você está em dia! 🎉</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {pendentes.slice(0, 4).map((a) => (
                <li key={a.id} className="rounded-lg border border-border p-3">
                  <div className="font-semibold text-foreground">{a.titulo}</div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{a.disciplina}</span>
                    <span className="inline-flex items-center gap-1 text-brand">
                      <Calendar className="h-3 w-3" /> {fmtData(a.prazo)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link to="/aluno/atividades" className="mt-3 inline-block text-xs font-semibold text-brand hover:underline">
            Ver todas →
          </Link>
        </Card>

        <Card title="Próximos prazos" icon={Calendar}>
          {proximosPrazos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem prazos cadastrados.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {proximosPrazos.map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="truncate font-medium text-foreground">{a.titulo}</span>
                  <span className="ml-2 shrink-0 text-xs text-brand">{fmtData(a.prazo)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Últimos avisos" icon={Bell}>
          {avisos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum aviso recente.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {avisos.map((a) => (
                <li key={a.titulo} className="rounded-lg border border-border p-3">
                  <div className="font-semibold text-foreground">{a.titulo}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{a.data}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <p className="mt-8 rounded-lg bg-secondary p-3 text-center text-xs text-muted-foreground">
        Todo o conteúdo é filtrado automaticamente pela sua turma ({aluno.turmaNome}).
      </p>
    </PainelLayout>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <Icon className="h-6 w-6 text-brand" />
      <div className="mt-3 text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Card({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand">
        <Icon className="h-4 w-4" /> {title}
      </h2>
      {children}
    </div>
  );
}
