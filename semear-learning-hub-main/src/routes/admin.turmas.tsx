import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useState } from "react";
import { Plus, Pencil, Trash2, Users, BookOpen, GraduationCap, X, ArrowRightLeft } from "lucide-react";

export const Route = createFileRoute("/admin/turmas")({
  head: () => ({
    meta: [
      { title: "Administração de Turmas — IES" },
      { name: "description", content: "Gerencie cursos e turmas do Instituto Educacional Semear." },
    ],
  }),
  component: AdminTurmas,
});

type Turma = {
  id: string;
  curso: string;
  nome: string;
  ano: number;
  semestre: number;
  professores: string[];
  disciplinas: string[];
  alunos: { nome: string; email: string }[];
};

const INITIAL: Turma[] = [
  {
    id: "ped-2024-2",
    curso: "Pedagogia",
    nome: "Pedagogia 2024.2",
    ano: 2024,
    semestre: 2,
    professores: ["Prof.ª Ana Lima"],
    disciplinas: ["Didática Geral", "Psicologia da Educação"],
    alunos: [
      { nome: "Carlos Souza", email: "carlos@email.com" },
      { nome: "Joana Pereira", email: "joana@email.com" },
    ],
  },
  {
    id: "ped-2025-1",
    curso: "Pedagogia",
    nome: "Pedagogia 2025.1",
    ano: 2025,
    semestre: 1,
    professores: ["Prof. João Mendes"],
    disciplinas: ["Fundamentos da Educação", "Sociologia da Educação"],
    alunos: [{ nome: "Mariana Alves", email: "mariana@email.com" }],
  },
  {
    id: "ped-2026-1",
    curso: "Pedagogia",
    nome: "Pedagogia 2026.1",
    ano: 2026,
    semestre: 1,
    professores: [],
    disciplinas: ["Introdução à Pedagogia", "Filosofia da Educação"],
    alunos: [{ nome: "Maria Silva", email: "maria@email.com" }],
  },
];

const CURSOS = ["Pedagogia"];

function AdminTurmas() {
  const [turmas, setTurmas] = useState<Turma[]>(INITIAL);
  const [editing, setEditing] = useState<Turma | null>(null);
  const [transfer, setTransfer] = useState<{ aluno: string; from: string } | null>(null);

  function salvar(t: Turma) {
    setTurmas((prev) => {
      const exists = prev.find((p) => p.id === t.id);
      return exists ? prev.map((p) => (p.id === t.id ? t : p)) : [...prev, t];
    });
    setEditing(null);
  }

  function excluir(id: string) {
    if (confirm("Excluir esta turma?")) setTurmas((prev) => prev.filter((p) => p.id !== id));
  }

  function novaTurma(): Turma {
    return {
      id: `nova-${Date.now()}`,
      curso: "Pedagogia",
      nome: "",
      ano: new Date().getFullYear(),
      semestre: 1,
      professores: [],
      disciplinas: [],
      alunos: [],
    };
  }

  function transferir(destinoId: string) {
    if (!transfer) return;
    setTurmas((prev) =>
      prev.map((t) => {
        if (t.id === transfer.from) return { ...t, alunos: t.alunos.filter((a) => a.nome !== transfer.aluno) };
        if (t.id === destinoId) {
          const original = prev.find((p) => p.id === transfer.from)!;
          const aluno = original.alunos.find((a) => a.nome === transfer.aluno)!;
          return { ...t, alunos: [...t.alunos, aluno] };
        }
        return t;
      }),
    );
    setTransfer(null);
  }

  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-10 text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="text-sm uppercase tracking-wider text-brand-light">Administração</p>
          <h1 className="text-3xl font-extrabold md:text-4xl">Cursos & Turmas</h1>
          <p className="mt-2 text-white/80">Crie, edite e gerencie turmas, professores, disciplinas e alunos.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-brand" />
            <span className="font-semibold text-foreground">Curso: Pedagogia</span>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">{turmas.length} turma(s)</span>
          </div>
          <button
            onClick={() => setEditing(novaTurma())}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-brand hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Nova turma
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Turma</th>
                <th className="px-4 py-3 text-left">Período</th>
                <th className="px-4 py-3 text-left">Professores</th>
                <th className="px-4 py-3 text-left">Disciplinas</th>
                <th className="px-4 py-3 text-left">Alunos</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {turmas.map((t) => (
                <tr key={t.id} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold text-foreground">{t.nome}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.ano}.{t.semestre}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.professores.length || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.disciplinas.length}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.alunos.length}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(t)} className="rounded-md p-2 text-brand hover:bg-secondary" title="Editar">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => excluir(t.id)} className="rounded-md p-2 text-destructive hover:bg-secondary" title="Excluir">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editing && (
          <EditModal
            turma={editing}
            onClose={() => setEditing(null)}
            onSave={salvar}
            onTransferAluno={(aluno) => setTransfer({ aluno, from: editing.id })}
          />
        )}

        {transfer && (
          <TransferModal
            aluno={transfer.aluno}
            turmas={turmas.filter((t) => t.id !== transfer.from)}
            onClose={() => setTransfer(null)}
            onConfirm={transferir}
          />
        )}
      </section>
    </SiteLayout>
  );

  function EditModal({
    turma,
    onClose,
    onSave,
    onTransferAluno,
  }: {
    turma: Turma;
    onClose: () => void;
    onSave: (t: Turma) => void;
    onTransferAluno: (nome: string) => void;
  }) {
    const [t, setT] = useState<Turma>(turma);
    const set = <K extends keyof Turma>(k: K, v: Turma[K]) => setT((s) => ({ ...s, [k]: v }));

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-lg font-bold text-foreground">{turma.nome ? "Editar turma" : "Nova turma"}</h2>
            <button onClick={onClose} className="rounded-md p-1 hover:bg-secondary"><X className="h-5 w-5" /></button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-foreground">Curso</span>
              <select value={t.curso} onChange={(e) => set("curso", e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm">
                {CURSOS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-foreground">Nome da turma</span>
              <input value={t.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Ex.: Pedagogia 2026.2" className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-foreground">Ano</span>
              <input type="number" value={t.ano} onChange={(e) => set("ano", Number(e.target.value))} className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-foreground">Semestre</span>
              <select value={t.semestre} onChange={(e) => set("semestre", Number(e.target.value))} className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm">
                <option value={1}>1º semestre</option>
                <option value={2}>2º semestre</option>
              </select>
            </label>
          </div>

          <ChipsEditor icon={Users} label="Professores vinculados" items={t.professores} onChange={(v) => set("professores", v)} placeholder="Nome do professor" />
          <ChipsEditor icon={BookOpen} label="Disciplinas" items={t.disciplinas} onChange={(v) => set("disciplinas", v)} placeholder="Nome da disciplina" />

          <div className="mt-6">
            <h3 className="mb-2 text-sm font-bold text-foreground">Alunos matriculados ({t.alunos.length})</h3>
            <div className="rounded-lg border border-border">
              {t.alunos.length === 0 ? (
                <p className="p-4 text-center text-xs text-muted-foreground">Nenhum aluno matriculado.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {t.alunos.map((a) => (
                    <li key={a.nome} className="flex items-center justify-between p-3 text-sm">
                      <div>
                        <div className="font-medium text-foreground">{a.nome}</div>
                        <div className="text-xs text-muted-foreground">{a.email}</div>
                      </div>
                      <button onClick={() => onTransferAluno(a.nome)} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-brand hover:bg-secondary">
                        <ArrowRightLeft className="h-3 w-3" /> Transferir
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
            <button onClick={onClose} className="rounded-full border border-border px-5 py-2 text-sm font-medium hover:bg-secondary">Cancelar</button>
            <button onClick={() => onSave(t)} disabled={!t.nome} className="rounded-full bg-gradient-brand px-6 py-2 text-sm font-semibold text-brand-foreground shadow-brand hover:opacity-90 disabled:opacity-50">Salvar</button>
          </div>
        </div>
      </div>
    );
  }
}

function ChipsEditor({
  icon: Icon,
  label,
  items,
  onChange,
  placeholder,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [val, setVal] = useState("");
  return (
    <div className="mt-4">
      <span className="mb-1 flex items-center gap-2 text-xs font-semibold text-foreground">
        <Icon className="h-4 w-4 text-brand" /> {label}
      </span>
      <div className="flex flex-wrap gap-2 rounded-lg border border-border p-2">
        {items.map((it) => (
          <span key={it} className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-xs text-brand">
            {it}
            <button onClick={() => onChange(items.filter((x) => x !== it))} className="hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && val.trim()) {
              e.preventDefault();
              onChange([...items, val.trim()]);
              setVal("");
            }
          }}
          placeholder={placeholder + " (Enter)"}
          className="min-w-[160px] flex-1 bg-transparent px-2 py-1 text-sm outline-none"
        />
      </div>
    </div>
  );
}

function TransferModal({
  aluno,
  turmas,
  onClose,
  onConfirm,
}: {
  aluno: string;
  turmas: Turma[];
  onClose: () => void;
  onConfirm: (destinoId: string) => void;
}) {
  const [destino, setDestino] = useState("");
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-lg font-bold text-foreground">Transferir aluno</h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-secondary"><X className="h-5 w-5" /></button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Aluno: <strong className="text-foreground">{aluno}</strong></p>
        <label className="mt-4 block">
          <span className="text-xs font-semibold text-foreground">Turma de destino</span>
          <select value={destino} onChange={(e) => setDestino(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm">
            <option value="">Selecione…</option>
            {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary">Cancelar</button>
          <button onClick={() => onConfirm(destino)} disabled={!destino} className="rounded-full bg-gradient-brand px-5 py-2 text-sm font-semibold text-brand-foreground shadow-brand hover:opacity-90 disabled:opacity-50">Confirmar transferência</button>
        </div>
      </div>
    </div>
  );
}
