import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PainelLayout } from "@/components/PainelLayout";
import { MENU_PROFESSOR } from "@/lib/menus";
import { store, type ProfessorSession, type Turma } from "@/lib/ies-store";
import { Users, BookOpen, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/professor/turmas")({
  head: () => ({ meta: [{ title: "Minhas Turmas — Professor" }] }),
  component: MinhasTurmas,
});

function MinhasTurmas() {
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

  if (!prof) return null;

  return (
    <PainelLayout
      perfil="professor"
      titulo={prof.nome}
      subtitulo={prof.disciplina}
      menu={MENU_PROFESSOR}
      onLogout={() => { store.logoutProfessor(); navigate({ to: "/" }); }}
    >
      <h1 className="mb-2 text-2xl font-extrabold text-foreground">Minhas Turmas</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Você visualiza apenas as turmas às quais foi vinculado pelo administrador.
      </p>

      {turmas.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-card">
          <p className="text-muted-foreground">Você ainda não foi vinculado a nenhuma turma.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {turmas.map((t) => (
            <div key={t.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-light">
                <Users className="h-4 w-4" /> {t.curso}
              </div>
              <h2 className="mt-2 text-lg font-bold text-foreground">{t.nome}</h2>
              <p className="text-xs text-muted-foreground">{t.ano} · {t.semestre}º semestre</p>

              <div className="mt-4 border-t border-border pt-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground">
                  <BookOpen className="h-3.5 w-3.5 text-brand" /> Disciplinas
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(t.disciplinas ?? []).map((d) => (
                    <span key={d} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground">{d}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <GraduationCap className="h-3.5 w-3.5" /> Alunos da turma listados após cadastro
              </div>
            </div>
          ))}
        </div>
      )}
    </PainelLayout>
  );
}
