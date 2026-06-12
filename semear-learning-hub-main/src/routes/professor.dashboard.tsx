import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PainelLayout } from "@/components/PainelLayout";
import { MENU_PROFESSOR } from "@/lib/menus";
import { store, type ProfessorSession, type Turma } from "@/lib/ies-store";
import { Users, FileText, ClipboardCheck, Bell, Calendar } from "lucide-react";

export const Route = createFileRoute("/professor/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard do Professor — IES" },
      { name: "description", content: "Painel exclusivo do professor: turmas, atividades e correções." },
    ],
  }),
  component: ProfessorDashboard,
});

function ProfessorDashboard() {
  const navigate = useNavigate();
  const [prof, setProf] = useState<ProfessorSession | null>(null);
  const [turmas, setTurmas] = useState<Turma[]>([]);

  useEffect(() => {
    const p = store.getProfessor();
    if (!p) {
      navigate({ to: "/area-professor" });
      return;
    }
    setProf(p);
    setTurmas(store.getTurmas().filter((t) => p.turmaIds.includes(t.id)));
  }, [navigate]);

  const atividades = useMemo(() => {
    if (!prof) return [];
    return store.getAtividades().filter((a) => prof.turmaIds.includes(a.turmaId));
  }, [prof]);

  const entregas = useMemo(() => {
    const ids = new Set(atividades.map((a) => a.id));
    return store.getEntregas().filter((e) => ids.has(e.atividadeId));
  }, [atividades]);

  if (!prof) return null;

  return (
    <PainelLayout
      perfil="professor"
      titulo={prof.nome}
      subtitulo={prof.disciplina}
      menu={MENU_PROFESSOR}
      onLogout={() => {
        store.logoutProfessor();
        navigate({ to: "/" });
      }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">Bem-vindo(a), {prof.nome}</h1>
        <p className="text-sm text-muted-foreground">Visão geral das suas turmas e atividades.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Users} label="Minhas turmas" value={turmas.length} />
        <Stat icon={FileText} label="Atividades publicadas" value={atividades.length} />
        <Stat icon={ClipboardCheck} label="Entregas recebidas" value={entregas.length} />
        <Stat icon={Bell} label="Pendentes de correção" value={entregas.filter((e) => !e.corrigida).length} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card title="Minhas turmas" icon={Users}>
          {turmas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Você ainda não está vinculado a nenhuma turma.</p>
          ) : (
            <ul className="space-y-2">
              {turmas.map((t) => (
                <li key={t.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                  <div>
                    <div className="font-semibold text-foreground">{t.nome}</div>
                    <div className="text-xs text-muted-foreground">{t.curso} · {t.ano}.{t.semestre}</div>
                  </div>
                  <Link to="/professor/turmas" className="text-xs font-semibold text-brand hover:underline">Ver</Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Últimas atividades" icon={FileText}>
          {atividades.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma atividade publicada.{" "}
              <Link to="/professor/atividades" className="font-semibold text-brand hover:underline">Criar agora</Link>
            </p>
          ) : (
            <ul className="space-y-2">
              {atividades.slice(0, 4).map((a) => {
                const turma = turmas.find((t) => t.id === a.turmaId);
                const e = entregas.filter((x) => x.atividadeId === a.id);
                return (
                  <li key={a.id} className="rounded-lg border border-border p-3 text-sm">
                    <div className="font-semibold text-foreground">{a.titulo}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{turma?.nome ?? a.turmaId}</span>
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(a.prazo).toLocaleDateString("pt-BR")}</span>
                      <span>{e.length} entrega(s)</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
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
