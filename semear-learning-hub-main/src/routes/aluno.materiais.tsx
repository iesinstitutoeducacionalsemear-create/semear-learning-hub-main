import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PainelLayout } from "@/components/PainelLayout";
import { MENU_ALUNO } from "@/lib/menus";
import { store, type AlunoSession, type Turma } from "@/lib/ies-store";
import { BookOpen, Download, FileText, Presentation, Image } from "lucide-react";

export const Route = createFileRoute("/aluno/materiais")({
  head: () => ({ meta: [{ title: "Materiais — Aluno" }] }),
  component: AlunoMateriais,
});

type Material = {
  id: string;
  titulo: string;
  disciplina: string;
  tipo: "pdf" | "doc" | "ppt" | "img";
  professor: string;
  dataPublicacao: string;
  tamanho: string;
};

// Materiais simulados por disciplina
const MATERIAIS_MOCK: Material[] = [
  { id: "m1", titulo: "Apostila de Didática Geral — Unidade 1", disciplina: "Didática Geral", tipo: "pdf", professor: "Prof. João Almeida", dataPublicacao: "2026-03-10", tamanho: "2,4 MB" },
  { id: "m2", titulo: "Slides: Teorias da Aprendizagem", disciplina: "Psicologia da Educação", tipo: "ppt", professor: "Prof. João Almeida", dataPublicacao: "2026-03-18", tamanho: "5,1 MB" },
  { id: "m3", titulo: "Texto Base — Capítulo 3: Avaliação", disciplina: "Didática Geral", tipo: "pdf", professor: "Prof. João Almeida", dataPublicacao: "2026-04-02", tamanho: "840 KB" },
  { id: "m4", titulo: "Roteiro de Estágio — Modelo ABNT", disciplina: "Estágio Supervisionado II", tipo: "doc", professor: "Prof. João Almeida", dataPublicacao: "2026-04-15", tamanho: "120 KB" },
  { id: "m5", titulo: "Mapa Mental: Piaget e Vygotsky", disciplina: "Psicologia da Educação", tipo: "img", professor: "Prof. João Almeida", dataPublicacao: "2026-05-05", tamanho: "1,8 MB" },
  { id: "m6", titulo: "Slides: Práticas Pedagógicas Contemporâneas", disciplina: "Didática Geral", tipo: "ppt", professor: "Prof. João Almeida", dataPublicacao: "2026-05-20", tamanho: "7,2 MB" },
  { id: "m7", titulo: "Checklist de Avaliação do Estágio", disciplina: "Estágio Supervisionado II", tipo: "pdf", professor: "Prof. João Almeida", dataPublicacao: "2026-06-01", tamanho: "310 KB" },
];

const TIPO_CFG = {
  pdf: { label: "PDF", icon: FileText, cls: "bg-red-100 text-red-700" },
  doc: { label: "DOC", icon: FileText, cls: "bg-blue-100 text-blue-700" },
  ppt: { label: "PPT", icon: Presentation, cls: "bg-orange-100 text-orange-700" },
  img: { label: "IMG", icon: Image, cls: "bg-purple-100 text-purple-700" },
};

function fmtDataBR(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function AlunoMateriais() {
  const navigate = useNavigate();
  const [aluno, setAluno] = useState<AlunoSession | null>(null);
  const [turma, setTurma] = useState<Turma | null>(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const a = store.getAluno();
    if (!a) { navigate({ to: "/area-aluno" }); return; }
    setAluno(a);
    setTurma(store.getTurmas().find((t) => t.id === a.turmaId) ?? null);
  }, [navigate]);

  const disciplinas = turma?.disciplinas ?? [];

  // Filtra materiais pelas disciplinas da turma do aluno
  const materiaisDaTurma = useMemo(() => {
    return MATERIAIS_MOCK.filter((m) => disciplinas.includes(m.disciplina));
  }, [disciplinas]);

  const filtrados = useMemo(() => {
    if (!filtro) return materiaisDaTurma;
    return materiaisDaTurma.filter((m) => m.disciplina === filtro);
  }, [materiaisDaTurma, filtro]);

  // Agrupa por disciplina
  const porDisciplina = useMemo(() => {
    const groups: Record<string, Material[]> = {};
    filtrados.forEach((m) => {
      if (!groups[m.disciplina]) groups[m.disciplina] = [];
      groups[m.disciplina].push(m);
    });
    return groups;
  }, [filtrados]);

  if (!aluno) return null;

  return (
    <PainelLayout
      perfil="aluno"
      titulo={aluno.nome}
      subtitulo={`${aluno.curso} · ${aluno.turmaNome}`}
      menu={MENU_ALUNO}
      onLogout={() => { store.logoutAluno(); navigate({ to: "/" }); }}
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Materiais de Apoio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Apostilas, slides e documentos disponibilizados pelos seus professores.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-muted-foreground">Filtrar por disciplina:</label>
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Todas</option>
            {disciplinas.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {Object.keys(porDisciplina).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            {materiaisDaTurma.length === 0
              ? "Nenhum material publicado para sua turma ainda."
              : "Nenhum material encontrado para este filtro."}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(porDisciplina).map(([disc, mats]) => (
            <div key={disc}>
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-brand" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-brand">{disc}</h2>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{mats.length}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {mats.map((mat) => {
                  const cfg = TIPO_CFG[mat.tipo];
                  const Icon = cfg.icon;
                  return (
                    <div key={mat.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-brand">
                      <div>
                        <div className="flex items-start gap-3">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${cfg.cls}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold leading-snug text-foreground">{mat.titulo}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{mat.professor}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{fmtDataBR(mat.dataPublicacao)}</span>
                          <span>·</span>
                          <span>{mat.tamanho}</span>
                          <span className={`ml-auto rounded-full px-2 py-0.5 font-semibold ${cfg.cls}`}>{cfg.label}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => alert("Mockup: download disponível após ativar Lovable Cloud.")}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand px-4 py-2 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white"
                      >
                        <Download className="h-3.5 w-3.5" /> Baixar
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </PainelLayout>
  );
}
