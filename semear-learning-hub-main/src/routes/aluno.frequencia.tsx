import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PainelLayout } from "@/components/PainelLayout";
import { MENU_ALUNO } from "@/lib/menus";
import { store, type AlunoSession, type Turma } from "@/lib/ies-store";
import { BookOpen, CalendarCheck, TrendingUp, UserCheck } from "lucide-react";

export const Route = createFileRoute("/aluno/frequencia")({
  head: () => ({ meta: [{ title: "Frequência — Aluno" }] }),
  component: AlunoFrequencia,
});

// Mock de frequência por disciplina (simulado, pois não há backend de chamadas)
const AULAS_MOCK = [
  { data: "2026-03-05", presenca: true },
  { data: "2026-03-12", presenca: true },
  { data: "2026-03-19", presenca: false },
  { data: "2026-03-26", presenca: true },
  { data: "2026-04-02", presenca: true },
  { data: "2026-04-09", presenca: true },
  { data: "2026-04-16", presenca: false },
  { data: "2026-04-23", presenca: true },
  { data: "2026-04-30", presenca: true },
  { data: "2026-05-07", presenca: true },
  { data: "2026-05-14", presenca: true },
  { data: "2026-05-21", presenca: false },
  { data: "2026-05-28", presenca: true },
  { data: "2026-06-04", presenca: true },
];

function fmtDataBR(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function AlunoFrequencia() {
  const navigate = useNavigate();
  const [aluno, setAluno] = useState<AlunoSession | null>(null);
  const [turma, setTurma] = useState<Turma | null>(null);

  useEffect(() => {
    const a = store.getAluno();
    if (!a) { navigate({ to: "/area-aluno" }); return; }
    setAluno(a);
    setTurma(store.getTurmas().find((t) => t.id === a.turmaId) ?? null);
  }, [navigate]);

  const disciplinas = turma?.disciplinas ?? [];

  // Gera frequência simulada por disciplina com seed diferente por nome
  const dadosPorDisciplina = useMemo(() => {
    return disciplinas.map((disc, idx) => {
      const aulas = AULAS_MOCK.map((a, i) => ({
        ...a,
        presenca: i % (idx + 2) !== 0, // variação por disciplina
      }));
      const presentes = aulas.filter((a) => a.presenca).length;
      const pct = Math.round((presentes / aulas.length) * 100);
      return { disc, aulas, presentes, total: aulas.length, pct };
    });
  }, [disciplinas]);

  const mediaFreq = useMemo(() => {
    if (dadosPorDisciplina.length === 0) return 0;
    return Math.round(dadosPorDisciplina.reduce((s, d) => s + d.pct, 0) / dadosPorDisciplina.length);
  }, [dadosPorDisciplina]);

  if (!aluno) return null;

  const freqColor = mediaFreq >= 75 ? "text-emerald-600" : mediaFreq >= 60 ? "text-amber-600" : "text-red-600";
  const barColor = mediaFreq >= 75 ? "bg-emerald-500" : mediaFreq >= 60 ? "bg-amber-500" : "bg-red-500";

  return (
    <PainelLayout
      perfil="aluno"
      titulo={aluno.nome}
      subtitulo={`${aluno.curso} · ${aluno.turmaNome}`}
      menu={MENU_ALUNO}
      onLogout={() => { store.logoutAluno(); navigate({ to: "/" }); }}
    >
      <h1 className="mb-1 text-2xl font-extrabold text-foreground">Frequência</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Sua presença nas aulas por disciplina. A frequência mínima exigida é de <strong>75%</strong>.
      </p>

      {/* Resumo */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <TrendingUp className="h-6 w-6 text-brand" />
          <div className={`mt-3 text-2xl font-bold ${freqColor}`}>{mediaFreq}%</div>
          <div className="text-xs text-muted-foreground">Frequência média geral</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <UserCheck className="h-6 w-6 text-brand" />
          <div className="mt-3 text-2xl font-bold text-foreground">{AULAS_MOCK.length * disciplinas.length}</div>
          <div className="text-xs text-muted-foreground">Total de aulas no período</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <CalendarCheck className="h-6 w-6 text-brand" />
          <div className="mt-3 text-2xl font-bold text-foreground">
            {dadosPorDisciplina.reduce((s, d) => s + d.presentes, 0)}
          </div>
          <div className="text-xs text-muted-foreground">Aulas assistidas</div>
        </div>
      </div>

      {/* Alerta de frequência baixa */}
      {mediaFreq < 75 && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          ⚠️ <strong>Atenção:</strong> Sua frequência está abaixo do mínimo exigido (75%). Regularize sua presença para não ser reprovado por faltas.
        </div>
      )}

      {disciplinas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Nenhuma disciplina cadastrada na sua turma ainda.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {dadosPorDisciplina.map(({ disc, aulas, presentes, total, pct }) => {
            const color = pct >= 75 ? "text-emerald-600" : pct >= 60 ? "text-amber-600" : "text-red-600";
            const bar = pct >= 75 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500";
            return (
              <div key={disc} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                <div className="border-b border-border bg-secondary/40 px-5 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-brand" />
                      <span className="text-sm font-bold text-foreground">{disc}</span>
                    </div>
                    <span className={`text-sm font-bold ${color}`}>{pct}%</span>
                  </div>
                  {/* Barra de progresso */}
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full rounded-full transition-all ${bar}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>{presentes} de {total} aulas</span>
                    <span>{pct >= 75 ? "✓ Regular" : "✗ Abaixo do mínimo"}</span>
                  </div>
                </div>

                {/* Grid de presenças */}
                <div className="p-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Registro de presenças</p>
                  <div className="flex flex-wrap gap-2">
                    {aulas.map((a) => (
                      <div
                        key={a.data}
                        title={fmtDataBR(a.data)}
                        className={`flex h-8 w-[72px] items-center justify-center rounded-lg text-[10px] font-semibold ${
                          a.presenca
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {a.presenca ? "✓" : "✗"} {fmtDataBR(a.data).slice(0, 5)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PainelLayout>
  );
}
