import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PainelLayout } from "@/components/PainelLayout";
import { MENU_ALUNO } from "@/lib/menus";
import { store, type AlunoSession, type Turma } from "@/lib/ies-store";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/aluno/disciplinas")({
  head: () => ({ meta: [{ title: "Minhas Disciplinas — Aluno" }] }),
  component: AlunoDisciplinas,
});

function AlunoDisciplinas() {
  const navigate = useNavigate();
  const [aluno, setAluno] = useState<AlunoSession | null>(null);
  const [turma, setTurma] = useState<Turma | null>(null);

  useEffect(() => {
    const a = store.getAluno();
    if (!a) { navigate({ to: "/area-aluno" }); return; }
    setAluno(a);
    setTurma(store.getTurmas().find((t) => t.id === a.turmaId) ?? null);
  }, [navigate]);

  if (!aluno) return null;
  const disciplinas = turma?.disciplinas ?? [];

  return (
    <PainelLayout
      perfil="aluno"
      titulo={aluno.nome}
      subtitulo={`${aluno.curso} · ${aluno.turmaNome}`}
      menu={MENU_ALUNO}
      onLogout={() => { store.logoutAluno(); navigate({ to: "/" }); }}
    >
      <h1 className="mb-2 text-2xl font-extrabold text-foreground">Minhas Disciplinas</h1>
      <p className="mb-6 text-sm text-muted-foreground">Disciplinas da turma {aluno.turmaNome}.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {disciplinas.map((d) => (
          <div key={d} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <BookOpen className="h-6 w-6 text-brand" />
            <h3 className="mt-3 text-base font-bold text-foreground">{d}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{aluno.turmaNome}</p>
          </div>
        ))}
      </div>
    </PainelLayout>
  );
}
