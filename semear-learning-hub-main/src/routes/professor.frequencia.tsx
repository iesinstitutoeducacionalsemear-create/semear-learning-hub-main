import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PainelLayout } from "@/components/PainelLayout";
import { MENU_PROFESSOR } from "@/lib/menus";
import { store, type ProfessorSession, type Turma } from "@/lib/ies-store";
import { CalendarCheck, Save, Users } from "lucide-react";

export const Route = createFileRoute("/professor/frequencia")({
  head: () => ({ meta: [{ title: "Frequência — Professor" }] }),
  component: ProfessorFrequencia,
});

// Gera datas de aula dos últimos 30 dias (quinzenais)
function gerarDatas(): string[] {
  const datas: string[] = [];
  const hoje = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() - i * 2);
    if (d <= hoje) datas.push(d.toISOString().slice(0, 10));
  }
  return datas.slice(-8); // últimas 8 aulas
}

function fmtDataBR(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

type Presenca = Record<string, Record<string, boolean>>; // alunoEmail -> data -> presença

function ProfessorFrequencia() {
  const navigate = useNavigate();
  const [prof, setProf] = useState<ProfessorSession | null>(null);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmaSel, setTurmaSel] = useState<string>("");
  const [presencas, setPresencas] = useState<Presenca>({});
  const [saved, setSaved] = useState(false);

  const datas = useMemo(() => gerarDatas(), []);

  useEffect(() => {
    const p = store.getProfessor();
    if (!p) { navigate({ to: "/area-professor" }); return; }
    setProf(p);
    const ts = store.getTurmas().filter((t) => p.turmaIds.includes(t.id));
    setTurmas(ts);
    if (ts.length > 0) setTurmaSel(ts[0].id);
  }, [navigate]);

  const turma = useMemo(() => turmas.find((t) => t.id === turmaSel) ?? null, [turmas, turmaSel]);
  const alunos = useMemo(() => turma?.alunos ?? [], [turma]);

  // Inicializa presenças ao mudar turma
  useEffect(() => {
    if (!turma) return;
    const stored = localStorage.getItem(`freq_${turmaSel}`);
    if (stored) {
      setPresencas(JSON.parse(stored));
    } else {
      // Gera presenças padrão (todos presentes)
      const p: Presenca = {};
      alunos.forEach((a) => {
        p[a.email] = {};
        datas.forEach((d) => { p[a.email][d] = true; });
      });
      setPresencas(p);
    }
    setSaved(false);
  }, [turmaSel, turma, alunos, datas]);

  function toggle(email: string, data: string) {
    setPresencas((prev) => ({
      ...prev,
      [email]: { ...prev[email], [data]: !prev[email]?.[data] },
    }));
    setSaved(false);
  }

  function salvar() {
    localStorage.setItem(`freq_${turmaSel}`, JSON.stringify(presencas));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function freqPct(email: string) {
    const dias = presencas[email] ?? {};
    const presentes = datas.filter((d) => dias[d]).length;
    return datas.length > 0 ? Math.round((presentes / datas.length) * 100) : 0;
  }

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
          <h1 className="text-2xl font-extrabold text-foreground">Frequência</h1>
          <p className="mt-1 text-sm text-muted-foreground">Registre a presença dos alunos por aula. Clique nas células para alternar.</p>
        </div>
        <div className="flex items-center gap-3">
          {turmas.length > 1 && (
            <select
              value={turmaSel}
              onChange={(e) => setTurmaSel(e.target.value)}
              className="rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none"
            >
              {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          )}
          <button
            onClick={salvar}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-gradient-brand text-brand-foreground shadow-brand hover:opacity-90"
            }`}
          >
            <Save className="h-4 w-4" />
            {saved ? "Salvo!" : "Salvar frequência"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <Users className="h-6 w-6 text-brand" />
          <div className="mt-3 text-2xl font-bold text-foreground">{alunos.length}</div>
          <div className="text-xs text-muted-foreground">Alunos na turma</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <CalendarCheck className="h-6 w-6 text-brand" />
          <div className="mt-3 text-2xl font-bold text-foreground">{datas.length}</div>
          <div className="text-xs text-muted-foreground">Aulas registradas</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <CalendarCheck className="h-6 w-6 text-emerald-500" />
          <div className="mt-3 text-2xl font-bold text-foreground">
            {alunos.length > 0
              ? Math.round(alunos.reduce((s, a) => s + freqPct(a.email), 0) / alunos.length)
              : 0}%
          </div>
          <div className="text-xs text-muted-foreground">Freq. média da turma</div>
        </div>
      </div>

      {alunos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Users className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Nenhum aluno matriculado nesta turma.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="sticky left-0 bg-secondary px-4 py-3 text-left min-w-[180px]">Aluno</th>
                  {datas.map((d) => (
                    <th key={d} className="px-3 py-3 text-center min-w-[70px]">
                      {fmtDataBR(d).slice(0, 5)}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center">Freq.</th>
                </tr>
              </thead>
              <tbody>
                {alunos.map((aluno) => {
                  const pct = freqPct(aluno.email);
                  return (
                    <tr key={aluno.email} className="border-t border-border hover:bg-secondary/10 transition-colors">
                      <td className="sticky left-0 bg-card px-4 py-3 border-r border-border">
                        <div className="font-semibold text-foreground">{aluno.nome}</div>
                        <div className="text-xs text-muted-foreground">{aluno.email}</div>
                      </td>
                      {datas.map((d) => {
                        const presente = presencas[aluno.email]?.[d] ?? true;
                        return (
                          <td key={d} className="px-3 py-3 text-center">
                            <button
                              onClick={() => toggle(aluno.email, d)}
                              title={presente ? "Presente — clique para marcar falta" : "Falta — clique para marcar presença"}
                              className={`h-8 w-8 mx-auto flex items-center justify-center rounded-full text-xs font-bold transition cursor-pointer ${
                                presente
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                            >
                              {presente ? "P" : "F"}
                            </button>
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center">
                        <span className={`font-bold text-sm ${pct >= 75 ? "text-emerald-600" : pct >= 60 ? "text-amber-600" : "text-red-600"}`}>
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
            <span className="mr-4"><span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700 text-[10px]">P</span> = Presente</span>
            <span><span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 font-bold text-red-700 text-[10px]">F</span> = Falta</span>
          </div>
        </div>
      )}
    </PainelLayout>
  );
}
