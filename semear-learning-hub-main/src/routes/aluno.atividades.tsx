import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PainelLayout } from "@/components/PainelLayout";
import { MENU_ALUNO } from "@/lib/menus";
import { store, type AlunoSession, type Atividade, type Entrega, fmtData, fmtDataHora } from "@/lib/ies-store";
import { Paperclip, Calendar, Upload, CheckCircle2, MessageSquare, Award, Clock, FileText, X } from "lucide-react";

export const Route = createFileRoute("/aluno/atividades")({
  head: () => ({ meta: [{ title: "Atividades — Aluno" }] }),
  component: AlunoAtividades,
});

type Status = "pendente" | "entregue" | "corrigida";

function statusDe(entrega: Entrega | undefined): Status {
  if (!entrega) return "pendente";
  if (entrega.corrigida) return "corrigida";
  return "entregue";
}

const STATUS_CFG: Record<Status, { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  pendente: { label: "Pendente", cls: "bg-amber-100 text-amber-800", icon: Clock },
  entregue: { label: "Entregue", cls: "bg-blue-100 text-blue-800", icon: Upload },
  corrigida: { label: "Corrigida", cls: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
};

function AlunoAtividades() {
  const navigate = useNavigate();
  const [aluno, setAluno] = useState<AlunoSession | null>(null);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [aberta, setAberta] = useState<Atividade | null>(null);

  function reload() {
    setAtividades(store.getAtividades());
    setEntregas(store.getEntregas());
  }

  useEffect(() => {
    const a = store.getAluno();
    if (!a) { navigate({ to: "/area-aluno" }); return; }
    setAluno(a);
    reload();
  }, [navigate]);

  const minhas = useMemo(
    () => (aluno ? atividades.filter((a) => a.turmaId === aluno.turmaId) : []),
    [atividades, aluno],
  );

  if (!aluno) return null;

  return (
    <PainelLayout
      perfil="aluno"
      titulo={aluno.nome}
      subtitulo={`${aluno.curso} · ${aluno.turmaNome}`}
      menu={MENU_ALUNO}
      onLogout={() => { store.logoutAluno(); navigate({ to: "/" }); }}
    >
      <h1 className="mb-2 text-2xl font-extrabold text-foreground">Atividades</h1>
      <p className="mb-6 text-sm text-muted-foreground">Atividades publicadas pelos professores da sua turma.</p>

      {minhas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Nenhuma atividade publicada para sua turma ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {minhas.map((a) => {
            const e = entregas.find((x) => x.atividadeId === a.id && x.alunoEmail === aluno.email);
            const s = statusDe(e);
            const Cfg = STATUS_CFG[s];
            return (
              <button
                key={a.id}
                onClick={() => setAberta(a)}
                className="block w-full rounded-2xl border border-border bg-card p-5 text-left shadow-card transition hover:border-brand"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wider text-brand-light">{a.disciplina} · {a.professorNome}</div>
                    <h3 className="mt-1 text-lg font-bold text-foreground">{a.titulo}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.descricao}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${Cfg.cls}`}>
                    <Cfg.icon className="h-3 w-3" /> {Cfg.label}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Publicada {fmtData(a.dataPublicacao)}</span>
                  <span className="inline-flex items-center gap-1 text-brand"><Calendar className="h-3 w-3" /> Prazo {fmtData(a.prazo)}</span>
                  <span className="inline-flex items-center gap-1"><Award className="h-3 w-3" /> {a.pontuacaoMax} pts</span>
                  {e?.nota !== undefined && <span className="font-semibold text-emerald-700">Nota: {e.nota}/{a.pontuacaoMax}</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {aberta && (
        <DetalheModal
          atividade={aberta}
          aluno={aluno}
          entrega={entregas.find((x) => x.atividadeId === aberta.id && x.alunoEmail === aluno.email)}
          onClose={() => setAberta(null)}
          onSaved={reload}
        />
      )}
    </PainelLayout>
  );
}

function DetalheModal({
  atividade,
  aluno,
  entrega,
  onClose,
  onSaved,
}: {
  atividade: Atividade;
  aluno: AlunoSession;
  entrega: Entrega | undefined;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [arquivoNome, setArquivoNome] = useState(entrega?.arquivoNome ?? "");

  function enviar() {
    if (!arquivoNome) return;
    const e: Entrega = {
      id: entrega?.id ?? `ent_${Date.now()}`,
      atividadeId: atividade.id,
      alunoEmail: aluno.email,
      alunoNome: aluno.nome,
      enviadaEm: new Date().toISOString(),
      arquivoNome,
      nota: entrega?.nota,
      observacao: entrega?.observacao,
      corrigida: entrega?.corrigida,
    };
    store.saveEntrega(e);
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/50 p-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold text-foreground">{atividade.titulo}</h2>
          <button onClick={onClose} aria-label="Fechar" className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-5 p-5">
          <div className="rounded-lg bg-secondary p-3 text-xs">
            <div><strong>Professor:</strong> {atividade.professorNome}</div>
            <div><strong>Disciplina:</strong> {atividade.disciplina}</div>
            <div><strong>Publicada:</strong> {fmtData(atividade.dataPublicacao)} · <strong>Prazo:</strong> {fmtData(atividade.prazo)}</div>
            <div><strong>Pontuação máxima:</strong> {atividade.pontuacaoMax}</div>
          </div>

          {atividade.descricao && (
            <div>
              <h3 className="mb-1 text-xs font-semibold uppercase text-brand">Descrição</h3>
              <p className="text-sm text-foreground">{atividade.descricao}</p>
            </div>
          )}

          {atividade.instrucoes && (
            <div>
              <h3 className="mb-1 text-xs font-semibold uppercase text-brand">Instruções</h3>
              <p className="whitespace-pre-line text-sm text-foreground">{atividade.instrucoes}</p>
            </div>
          )}

          {atividade.anexoNome && (
            <div>
              <h3 className="mb-1 text-xs font-semibold uppercase text-brand">Anexo do professor</h3>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert("Mockup: download disponível após ativar Lovable Cloud."); }}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-brand hover:bg-secondary"
              >
                <Paperclip className="h-4 w-4" /> Baixar {atividade.anexoNome}
              </a>
            </div>
          )}

          <div className="border-t border-border pt-4">
            <h3 className="mb-2 text-xs font-semibold uppercase text-brand">Sua entrega</h3>
            {entrega && (
              <p className="mb-2 text-xs text-muted-foreground">
                Enviada em {fmtDataHora(entrega.enviadaEm)}
                {entrega.arquivoNome && <> · <span className="text-brand">{entrega.arquivoNome}</span></>}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
                onChange={(e) => setArquivoNome(e.target.files?.[0]?.name ?? "")}
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand"
              />
              <button
                onClick={enviar}
                disabled={!arquivoNome}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2 text-sm font-semibold text-brand-foreground shadow-brand hover:opacity-90 disabled:opacity-50"
              >
                <Upload className="h-4 w-4" /> {entrega ? "Reenviar" : "Enviar atividade"}
              </button>
            </div>
          </div>

          {entrega?.corrigida && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <h3 className="flex items-center gap-1 text-xs font-semibold uppercase text-emerald-800">
                <CheckCircle2 className="h-3 w-3" /> Atividade corrigida
              </h3>
              <p className="mt-2 text-lg font-bold text-emerald-900">
                Nota: {entrega.nota}/{atividade.pontuacaoMax}
              </p>
              {entrega.observacao && (
                <p className="mt-2 flex gap-2 text-sm text-emerald-900">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" /> {entrega.observacao}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
