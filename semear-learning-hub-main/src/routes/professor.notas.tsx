import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PainelLayout } from "@/components/PainelLayout";
import { MENU_PROFESSOR } from "@/lib/menus";
import { store, type Atividade, type Entrega, type ProfessorSession, type Turma } from "@/lib/ies-store";
import { Award, BookOpen, CheckCircle2, Users } from "lucide-react";

export const Route = createFileRoute("/professor/notas")({
  head: () => ({ meta: [{ title: "Notas — Professor" }] }),
  component: ProfessorNotas,
});

function ProfessorNotas() {
  const navigate = useNavigate();
  const [prof, setProf] = useState<ProfessorSession | null>(null);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [turmaSel, setTurmaSel] = useState<string>("");

  useEffect(() => {
    const p = store.getProfessor();
    if (!p) { navigate({ to: "/area-professor" }); return; }
    setProf(p);
    const ts = store.getTurmas().filter((t) => p.turmaIds.includes(t.id));
    setTurmas(ts);
    if (ts.length > 0) setTurmaSel(ts[0].id);
    setAtividades(store.getAtividades());
    setEntregas(store.getEntregas());
  }, [navigate]);

  const turma = useMemo(() => turmas.find((t) => t.id === turmaSel) ?? null, [turmas, turmaSel]);
  const alunos = useMemo(() => turma?.alunos ?? [], [turma]);
  const ativsDoProf = useMemo(
    () => (prof ? atividades.filter((a) => a.turmaId === turmaSel && prof.turmaIds.includes(a.turmaId)) : []),
    [atividades, turmaSel, prof],
  );

  // Para cada aluno, calcula media nas atividades corrigidas
  const linhas = useMemo(() => {
    return alunos.map((aluno) => {
      const notas = ativsDoProf.map((at) => {
        const e = entregas.find((x) => x.atividadeId === at.id && x.alunoEmail === aluno.email);
        return { titulo: at.titulo, pontuacaoMax: at.pontuacaoMax, entrega: e };
      });
      const corrigidas = notas.filter((n) => n.entrega?.corrigida);
      const media =
        corrigidas.length > 0
          ? corrigidas.reduce((s, n) => s + ((n.entrega!.nota ?? 0) / n.pontuacaoMax) * 10, 0) / corrigidas.length
          : null;
      return { aluno, notas, media };
    });
  }, [alunos, ativsDoProf, entregas]);

  if (!prof) return null;

  return (
    <PainelLayout
      perfil="professor"
      titulo={prof.nome}
      subtitulo={prof.disciplina}
      menu={MENU_PROFESSOR}
      onLogout={() => { store.logoutProfessor(); navigate({ to: "/" }); }}
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Notas</h1>
          <p className="mt-1 text-sm text-muted-foreground">Consolidado de notas dos alunos por turma.</p>
        </div>
        {turmas.length > 1 && (
          <select
            value={turmaSel}
            onChange={(e) => setTurmaSel(e.target.value)}
            className="rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
        )}
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <Users className="h-6 w-6 text-brand" />
          <div className="mt-3 text-2xl font-bold text-foreground">{alunos.length}</div>
          <div className="text-xs text-muted-foreground">Alunos na turma</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <BookOpen className="h-6 w-6 text-brand" />
          <div className="mt-3 text-2xl font-bold text-foreground">{ativsDoProf.length}</div>
          <div className="text-xs text-muted-foreground">Atividades publicadas</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <CheckCircle2 className="h-6 w-6 text-brand" />
          <div className="mt-3 text-2xl font-bold text-foreground">
            {entregas.filter((e) => e.corrigida && ativsDoProf.some((a) => a.id === e.atividadeId)).length}
          </div>
          <div className="text-xs text-muted-foreground">Correções realizadas</div>
        </div>
      </div>

      {alunos.length === 0 || ativsDoProf.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Award className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            {alunos.length === 0
              ? "Nenhum aluno matriculado nesta turma."
              : "Publique atividades para visualizar as notas."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Aluno</th>
                  {ativsDoProf.map((a) => (
                    <th key={a.id} className="px-4 py-3 text-center max-w-[120px]">
                      <span className="block truncate" title={a.titulo}>{a.titulo}</span>
                      <span className="text-[10px] text-muted-foreground/70">max {a.pontuacaoMax}</span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center">Média</th>
                </tr>
              </thead>
              <tbody>
                {linhas.map(({ aluno, notas, media }) => (
                  <tr key={aluno.email} className="border-t border-border hover:bg-secondary/10 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">{aluno.nome}</div>
                      <div className="text-xs text-muted-foreground">{aluno.email}</div>
                    </td>
                    {notas.map(({ titulo, pontuacaoMax, entrega }) => (
                      <td key={titulo} className="px-4 py-3 text-center">
                        {entrega?.corrigida && entrega.nota !== undefined ? (
                          <span className={`font-bold ${entrega.nota / pontuacaoMax >= 0.7 ? "text-emerald-600" : entrega.nota / pontuacaoMax >= 0.5 ? "text-amber-600" : "text-red-600"}`}>
                            {entrega.nota}
                          </span>
                        ) : entrega ? (
                          <span className="text-xs text-blue-600">Entregue</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center">
                      {media !== null ? (
                        <span className={`font-bold text-base ${media >= 7 ? "text-emerald-600" : media >= 5 ? "text-amber-600" : "text-red-600"}`}>
                          {media.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PainelLayout>
  );
}
