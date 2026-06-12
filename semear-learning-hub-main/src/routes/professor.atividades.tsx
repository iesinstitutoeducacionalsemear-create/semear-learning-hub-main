import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PainelLayout } from "@/components/PainelLayout";
import { MENU_PROFESSOR } from "@/lib/menus";
import { store, type Atividade, type Entrega, type ProfessorSession, type Turma, fmtData, fmtDataHora } from "@/lib/ies-store";
import { Plus, FileText, Calendar, Paperclip, CheckCircle2, Clock, X, Save } from "lucide-react";

export const Route = createFileRoute("/professor/atividades")({
  head: () => ({ meta: [{ title: "Atividades — Professor" }] }),
  component: ProfessorAtividades,
});

function ProfessorAtividades() {
  const navigate = useNavigate();
  const [prof, setProf] = useState<ProfessorSession | null>(null);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [showNova, setShowNova] = useState(false);
  const [atividadeAberta, setAtividadeAberta] = useState<Atividade | null>(null);

  function reload() {
    setAtividades(store.getAtividades());
    setEntregas(store.getEntregas());
  }

  useEffect(() => {
    const p = store.getProfessor();
    if (!p) {
      navigate({ to: "/area-professor" });
      return;
    }
    setProf(p);
    setTurmas(store.getTurmas().filter((t) => p.turmaIds.includes(t.id)));
    reload();
  }, [navigate]);

  const minhas = useMemo(
    () => (prof ? atividades.filter((a) => prof.turmaIds.includes(a.turmaId)) : []),
    [atividades, prof],
  );

  if (!prof) return null;

  return (
    <PainelLayout
      perfil="professor"
      titulo={prof.nome}
      subtitulo={prof.disciplina}
      menu={MENU_PROFESSOR}
      onLogout={() => { store.logoutProfessor(); navigate({ to: "/" }); }}
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Atividades</h1>
          <p className="text-sm text-muted-foreground">Crie, publique e corrija atividades das suas turmas.</p>
        </div>
        <button
          onClick={() => setShowNova(true)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-brand hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Nova atividade
        </button>
      </div>

      {minhas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Nenhuma atividade publicada ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {minhas.map((a) => {
            const turma = turmas.find((t) => t.id === a.turmaId);
            const e = entregas.filter((x) => x.atividadeId === a.id);
            const corrigidas = e.filter((x) => x.corrigida).length;
            return (
              <button
                key={a.id}
                onClick={() => setAtividadeAberta(a)}
                className="block w-full rounded-2xl border border-border bg-card p-5 text-left shadow-card transition hover:border-brand"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wider text-brand-light">{turma?.nome ?? a.turmaId} · {a.disciplina}</div>
                    <h3 className="mt-1 text-lg font-bold text-foreground">{a.titulo}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.descricao}</p>
                  </div>
                  <div className="flex flex-col items-end text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 text-brand"><Calendar className="h-3 w-3" /> Prazo {fmtData(a.prazo)}</span>
                    <span className="mt-1">Pontuação: {a.pontuacaoMax}</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <Tag><CheckCircle2 className="h-3 w-3" /> {e.length} entrega(s)</Tag>
                  <Tag><Clock className="h-3 w-3" /> {corrigidas}/{e.length} corrigida(s)</Tag>
                  {a.anexoNome && <Tag><Paperclip className="h-3 w-3" /> {a.anexoNome}</Tag>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {showNova && (
        <NovaAtividadeModal
          professor={prof}
          turmas={turmas}
          onClose={() => setShowNova(false)}
          onSaved={() => { setShowNova(false); reload(); }}
        />
      )}

      {atividadeAberta && (
        <CorrecoesModal
          atividade={atividadeAberta}
          entregas={entregas.filter((e) => e.atividadeId === atividadeAberta.id)}
          onClose={() => setAtividadeAberta(null)}
          onSaved={() => reload()}
        />
      )}
    </PainelLayout>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-foreground">{children}</span>;
}

function NovaAtividadeModal({
  professor,
  turmas,
  onClose,
  onSaved,
}: {
  professor: ProfessorSession;
  turmas: Turma[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    turmaId: turmas[0]?.id ?? "",
    disciplina: professor.disciplina,
    titulo: "",
    descricao: "",
    instrucoes: "",
    anexoNome: "",
    dataPublicacao: new Date().toISOString().slice(0, 10),
    prazo: "",
    pontuacaoMax: 10,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.turmaId || !form.titulo || !form.prazo) return;
    const a: Atividade = {
      id: `at_${Date.now()}`,
      turmaId: form.turmaId,
      professorNome: professor.nome,
      professorEmail: professor.email,
      disciplina: form.disciplina,
      titulo: form.titulo,
      descricao: form.descricao,
      instrucoes: form.instrucoes,
      anexoNome: form.anexoNome || undefined,
      dataPublicacao: form.dataPublicacao,
      prazo: form.prazo,
      pontuacaoMax: Number(form.pontuacaoMax) || 10,
      criadaEm: new Date().toISOString(),
    };
    store.saveAtividade(a);
    onSaved();
  }

  return (
    <Modal onClose={onClose} titulo="Nova atividade">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Turma" required>
            <select required value={form.turmaId} onChange={(e) => setForm({ ...form, turmaId: e.target.value })} className={inputCls}>
              {turmas.map((t) => (<option key={t.id} value={t.id}>{t.nome}</option>))}
            </select>
          </Field>
          <Field label="Disciplina" required>
            <input required value={form.disciplina} onChange={(e) => setForm({ ...form, disciplina: e.target.value })} className={inputCls} />
          </Field>
        </div>

        <Field label="Título" required>
          <input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className={inputCls} placeholder="Ex: Resenha — Capítulo 3" />
        </Field>

        <Field label="Descrição">
          <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={2} className={inputCls} />
        </Field>

        <Field label="Instruções">
          <textarea value={form.instrucoes} onChange={(e) => setForm({ ...form, instrucoes: e.target.value })} rows={3} className={inputCls} placeholder="Detalhes, critérios de avaliação…" />
        </Field>

        <Field label="Arquivo anexo (PDF, DOCX, PPT, imagem)">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
            onChange={(e) => setForm({ ...form, anexoNome: e.target.files?.[0]?.name ?? "" })}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand"
          />
          {form.anexoNome && <p className="mt-1 text-xs text-muted-foreground">Anexo: {form.anexoNome}</p>}
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Publicação" required>
            <input type="date" required value={form.dataPublicacao} onChange={(e) => setForm({ ...form, dataPublicacao: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Prazo de entrega" required>
            <input type="date" required value={form.prazo} onChange={(e) => setForm({ ...form, prazo: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Pontuação máxima" required>
            <input type="number" min={0} max={100} required value={form.pontuacaoMax} onChange={(e) => setForm({ ...form, pontuacaoMax: Number(e.target.value) })} className={inputCls} />
          </Field>
        </div>

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <button type="button" onClick={onClose} className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-secondary">Cancelar</button>
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2 text-sm font-semibold text-brand-foreground shadow-brand hover:opacity-90">
            <Save className="h-4 w-4" /> Publicar para a turma
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Ao publicar, todos os alunos da turma recebem a atividade automaticamente.
        </p>
      </form>
    </Modal>
  );
}

function CorrecoesModal({
  atividade,
  entregas,
  onClose,
  onSaved,
}: {
  atividade: Atividade;
  entregas: Entrega[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [edit, setEdit] = useState<Record<string, { nota: string; observacao: string }>>(
    () => Object.fromEntries(entregas.map((e) => [e.id, { nota: e.nota?.toString() ?? "", observacao: e.observacao ?? "" }])),
  );

  function corrigir(e: Entrega) {
    const v = edit[e.id];
    const nota = v.nota === "" ? undefined : Number(v.nota);
    store.updateEntrega(e.id, { nota, observacao: v.observacao, corrigida: nota !== undefined });
    onSaved();
  }

  return (
    <Modal onClose={onClose} titulo={atividade.titulo}>
      <div className="mb-4 space-y-1 rounded-lg bg-secondary p-3 text-xs">
        <div><strong>Prazo:</strong> {fmtData(atividade.prazo)}</div>
        <div><strong>Pontuação máxima:</strong> {atividade.pontuacaoMax}</div>
        <div><strong>Entregas:</strong> {entregas.length}</div>
      </div>

      {entregas.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nenhum aluno entregou ainda.
        </p>
      ) : (
        <div className="space-y-3">
          {entregas.map((e) => (
            <div key={e.id} className="rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-foreground">{e.alunoNome}</div>
                  <div className="text-xs text-muted-foreground">{e.alunoEmail} · enviada em {fmtDataHora(e.enviadaEm)}</div>
                  {e.arquivoNome && (
                    <div className="mt-1 inline-flex items-center gap-1 text-xs text-brand">
                      <Paperclip className="h-3 w-3" /> {e.arquivoNome}
                    </div>
                  )}
                </div>
                {e.corrigida && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                    <CheckCircle2 className="h-3 w-3" /> Corrigida
                  </span>
                )}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-[120px_1fr_auto]">
                <input
                  type="number"
                  min={0}
                  max={atividade.pontuacaoMax}
                  placeholder={`Nota / ${atividade.pontuacaoMax}`}
                  value={edit[e.id]?.nota ?? ""}
                  onChange={(ev) => setEdit({ ...edit, [e.id]: { ...edit[e.id], nota: ev.target.value } })}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
                <input
                  placeholder="Observação ao aluno"
                  value={edit[e.id]?.observacao ?? ""}
                  onChange={(ev) => setEdit({ ...edit, [e.id]: { ...edit[e.id], observacao: ev.target.value } })}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
                <button
                  onClick={() => corrigir(e)}
                  className="rounded-full bg-gradient-brand px-4 py-2 text-xs font-semibold text-brand-foreground shadow-brand hover:opacity-90"
                >
                  Devolver corrigida
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

function Modal({ titulo, onClose, children }: { titulo: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/50 p-4 py-10">
      <div className="w-full max-w-3xl rounded-2xl bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold text-foreground">{titulo}</h2>
          <button onClick={onClose} aria-label="Fechar" className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
