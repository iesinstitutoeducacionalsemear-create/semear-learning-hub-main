import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PainelLayout } from "@/components/PainelLayout";
import { MENU_ALUNO } from "@/lib/menus";
import { store, type AlunoSession, type Atividade, type Entrega, type Turma } from "@/lib/ies-store";
import { Award, BookOpen, CheckCircle2, Clock, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/aluno/notas")({
  head: () => ({ meta: [{ title: "Notas — Aluno" }] }),
  component: AlunoNotas,
});

function AlunoNotas() {
  const navigate = useNavigate();
  const [aluno, setAluno] = useState<AlunoSession | null>(null);
  const [turma, setTurma] = useState<Turma | null>(null);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [entregas, setEntregas] = useState<Entrega[]>([]);

  useEffect(() => {
    const a = store.getAluno();
    if (!a) { navigate({ to: "/area-aluno" }); return; }
    setAluno(a);
    setTurma(store.getTurmas().find((t) => t.id === a.turmaId) ?? null);
    setAtividades(store.getAtividades().filter((x) => x.turmaId === a.turmaId));
    setEntregas(store.getEntregas().filter((x) => x.alunoEmail === a.email));
  }, [navigate]);

  const disciplinas = useMemo(() => turma?.disciplinas ?? [], [turma]);

  // Agrupa notas por disciplina
  const porDisciplina = useMemo(() => {
    return disciplinas.map((disc) => {
      const ats = atividades.filter((a) => a.disciplina === disc);
      const rows = ats.map((a) => {
        const e = entregas.find((x) => x.atividadeId === a.id);
        return { atividade: a, entrega: e };
      });
      const corrigidas = rows.filter((r) => r.entrega?.corrigida);
      const media =
        corrigidas.length > 0
          ? corrigidas.reduce((s, r) => s + ((r.entrega!.nota ?? 0) / r.atividade.pontuacaoMax) * 10, 0) /
            corrigidas.length
          : null;
      return { disc, rows, media };
    });
  }, [disciplinas, atividades, entregas]);

  const mediaGeral = useMemo(() => {
    const validas = porDisciplina.filter((d) => d.media !== null);
    if (validas.length === 0) return null;
    return validas.reduce((s, d) => s + d.media!, 0) / validas.length;
  }, [porDisciplina]);

  if (!aluno) return null;

  return (
    <PainelLayout
      perfil="aluno"
      titulo={aluno.nome}
      subtitulo={`${aluno.curso} · ${aluno.turmaNome}`}
      menu={MENU_ALUNO}
      onLogout={() => { store.logoutAluno(); navigate({ to: "/" }); }}
    >
      <h1 className="mb-1 text-2xl font-extrabold text-foreground">Notas</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Acompanhe suas notas por disciplina. Apenas atividades corrigidas pelo professor são contabilizadas.
      </p>

      {/* Resumo geral */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <SumCard
          icon={TrendingUp}
          label="Média Geral"
          value={mediaGeral !== null ? mediaGeral.toFixed(1) : "—"}
          color={mediaGeral !== null ? (mediaGeral >= 7 ? "text-emerald-600" : mediaGeral >= 5 ? "text-amber-600" : "text-red-600") : "text-muted-foreground"}
        />
        <SumCard icon={CheckCircle2} label="Atividades corrigidas" value={String(entregas.filter((e) => e.corrigida).length)} />
        <SumCard icon={Clock} label="Aguardando correção" value={String(entregas.filter((e) => !e.corrigida).length)} />
      </div>

      {porDisciplina.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Nenhuma disciplina cadastrada na sua turma ainda.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {porDisciplina.map(({ disc, rows, media }) => (
            <div key={disc} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-brand" />
                  <span className="text-sm font-bold text-foreground">{disc}</span>
                </div>
                {media !== null && (
                  <span className={`text-sm font-bold ${media >= 7 ? "text-emerald-600" : media >= 5 ? "text-amber-600" : "text-red-600"}`}>
                    Média: {media.toFixed(1)}
                  </span>
                )}
              </div>

              {rows.length === 0 ? (
                <p className="px-5 py-4 text-sm text-muted-foreground">Nenhuma atividade publicada nesta disciplina.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-5 py-2.5 text-left">Atividade</th>
                      <th className="px-5 py-2.5 text-center">Pontuação máx.</th>
                      <th className="px-5 py-2.5 text-center">Nota</th>
                      <th className="px-5 py-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ atividade, entrega }) => {
                      const corrigida = entrega?.corrigida;
                      const nota = entrega?.nota;
                      return (
                        <tr key={atividade.id} className="border-t border-border">
                          <td className="px-5 py-3 font-medium text-foreground">{atividade.titulo}</td>
                          <td className="px-5 py-3 text-center text-muted-foreground">{atividade.pontuacaoMax}</td>
                          <td className="px-5 py-3 text-center font-bold">
                            {corrigida && nota !== undefined ? (
                              <span className={nota / atividade.pontuacaoMax >= 0.7 ? "text-emerald-600" : nota / atividade.pontuacaoMax >= 0.5 ? "text-amber-600" : "text-red-600"}>
                                {nota}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-center">
                            {!entrega ? (
                              <Badge cls="bg-secondary text-muted-foreground">Não entregue</Badge>
                            ) : corrigida ? (
                              <Badge cls="bg-emerald-100 text-emerald-800">Corrigida</Badge>
                            ) : (
                              <Badge cls="bg-amber-100 text-amber-800">Aguardando</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </PainelLayout>
  );
}

function SumCard({ icon: Icon, label, value, color }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <Icon className="h-6 w-6 text-brand" />
      <div className={`mt-3 text-2xl font-bold ${color ?? "text-foreground"}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Badge({ cls, children }: { cls: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}
