import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PainelLayout } from "@/components/PainelLayout";
import { MENU_PROFESSOR } from "@/lib/menus";
import { store, type ProfessorSession, type Turma } from "@/lib/ies-store";
import { Download, FileText, FolderOpen, Image, Presentation, Plus, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/professor/materiais")({
  head: () => ({ meta: [{ title: "Materiais — Professor" }] }),
  component: ProfessorMateriais,
});

type Material = {
  id: string;
  titulo: string;
  disciplina: string;
  tipo: "pdf" | "doc" | "ppt" | "img";
  tamanho: string;
  dataPublicacao: string;
  turmaId: string;
};

const TIPO_CFG = {
  pdf: { label: "PDF", icon: FileText, cls: "bg-red-100 text-red-700" },
  doc: { label: "DOC", icon: FileText, cls: "bg-blue-100 text-blue-700" },
  ppt: { label: "PPT", icon: Presentation, cls: "bg-orange-100 text-orange-700" },
  img: { label: "IMG", icon: Image, cls: "bg-purple-100 text-purple-700" },
};

// Materiais mock iniciais
const MATERIAIS_INICIAIS: Material[] = [
  { id: "m1", titulo: "Apostila Unidade 1", disciplina: "Fundamentos da Educação", tipo: "pdf", tamanho: "2,4 MB", dataPublicacao: "2026-03-10", turmaId: "ped-2026-1" },
  { id: "m2", titulo: "Slides: Introdução à Pedagogia", disciplina: "Introdução à Pedagogia", tipo: "ppt", tamanho: "5,1 MB", dataPublicacao: "2026-03-18", turmaId: "ped-2026-1" },
  { id: "m3", titulo: "Texto Complementar — Freire", disciplina: "Fundamentos da Educação", tipo: "doc", tamanho: "310 KB", dataPublicacao: "2026-04-05", turmaId: "ped-2025-1" },
];

function fmtDataBR(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function ProfessorMateriais() {
  const navigate = useNavigate();
  const [prof, setProf] = useState<ProfessorSession | null>(null);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmaSel, setTurmaSel] = useState<string>("");
  const [materiais, setMateriais] = useState<Material[]>(MATERIAIS_INICIAIS);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const p = store.getProfessor();
    if (!p) { navigate({ to: "/area-professor" }); return; }
    setProf(p);
    const ts = store.getTurmas().filter((t) => p.turmaIds.includes(t.id));
    setTurmas(ts);
    if (ts.length > 0) setTurmaSel(ts[0].id);
  }, [navigate]);

  const turma = useMemo(() => turmas.find((t) => t.id === turmaSel) ?? null, [turmas, turmaSel]);
  const disciplinas = useMemo(() => turma?.disciplinas ?? [], [turma]);
  const materiaisDaTurma = useMemo(() => materiais.filter((m) => m.turmaId === turmaSel), [materiais, turmaSel]);

  function excluir(id: string) {
    setMateriais((prev) => prev.filter((m) => m.id !== id));
  }

  function adicionar(m: Omit<Material, "id">) {
    setMateriais((prev) => [{ ...m, id: `m-${Date.now()}` }, ...prev]);
    setShowModal(false);
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
          <h1 className="text-2xl font-extrabold text-foreground">Materiais</h1>
          <p className="mt-1 text-sm text-muted-foreground">Publique arquivos de apoio para suas turmas.</p>
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
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-brand hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Publicar material
          </button>
        </div>
      </div>

      {materiaisDaTurma.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <FolderOpen className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Nenhum material publicado para esta turma ainda.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2 text-sm font-semibold text-brand-foreground shadow-brand hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Publicar primeiro material
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {materiaisDaTurma.map((mat) => {
            const cfg = TIPO_CFG[mat.tipo];
            const Icon = cfg.icon;
            return (
              <div key={mat.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-brand">
                <div>
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cfg.cls}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold leading-snug text-foreground">{mat.titulo}</p>
                      <p className="mt-0.5 text-xs text-brand font-medium">{mat.disciplina}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{fmtDataBR(mat.dataPublicacao)}</span>
                    <span>·</span>
                    <span>{mat.tamanho}</span>
                    <span className={`ml-auto rounded-full px-2 py-0.5 font-semibold ${cfg.cls}`}>{cfg.label}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => alert("Mockup: download disponível após ativar Lovable Cloud.")}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-brand px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-white transition"
                  >
                    <Download className="h-3.5 w-3.5" /> Baixar
                  </button>
                  <button
                    onClick={() => excluir(mat.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-destructive hover:bg-destructive hover:text-white transition"
                    title="Excluir material"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <NovoMaterialModal
          turmaId={turmaSel}
          disciplinas={disciplinas}
          onClose={() => setShowModal(false)}
          onSave={adicionar}
        />
      )}
    </PainelLayout>
  );
}

function NovoMaterialModal({
  turmaId,
  disciplinas,
  onClose,
  onSave,
}: {
  turmaId: string;
  disciplinas: string[];
  onClose: () => void;
  onSave: (m: Omit<Material, "id">) => void;
}) {
  const [titulo, setTitulo] = useState("");
  const [disciplina, setDisciplina] = useState(disciplinas[0] ?? "");
  const [tipo, setTipo] = useState<Material["tipo"]>("pdf");
  const [arquivo, setArquivo] = useState<File | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo || !arquivo) return;
    const tamanho = arquivo.size < 1024 * 1024
      ? `${Math.round(arquivo.size / 1024)} KB`
      : `${(arquivo.size / (1024 * 1024)).toFixed(1)} MB`;
    onSave({
      titulo,
      disciplina,
      tipo,
      tamanho,
      dataPublicacao: new Date().toISOString().slice(0, 10),
      turmaId,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold text-foreground">Publicar material</h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4 p-5">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-foreground">Título *</span>
            <input
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Apostila Unidade 2"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          {disciplinas.length > 0 && (
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-foreground">Disciplina</span>
              <select
                value={disciplina}
                onChange={(e) => setDisciplina(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none"
              >
                {disciplinas.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>
          )}
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-foreground">Tipo de arquivo</span>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as Material["tipo"])}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none"
            >
              <option value="pdf">PDF</option>
              <option value="doc">DOC / DOCX</option>
              <option value="ppt">PPT / PPTX</option>
              <option value="img">Imagem</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-foreground">Arquivo *</span>
            <input
              required
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
              onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand"
            />
          </label>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button type="button" onClick={onClose} className="rounded-full border border-border px-5 py-2 text-sm hover:bg-secondary">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!titulo || !arquivo}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2 text-sm font-semibold text-brand-foreground shadow-brand hover:opacity-90 disabled:opacity-50"
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
