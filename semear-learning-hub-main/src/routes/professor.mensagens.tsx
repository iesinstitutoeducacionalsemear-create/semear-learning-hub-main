import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useMemo, useState } from "react";
import { PainelLayout } from "@/components/PainelLayout";
import { MENU_PROFESSOR } from "@/lib/menus";
import { store, type ProfessorSession, type Turma } from "@/lib/ies-store";
import { MessageSquare, Send, Users } from "lucide-react";

export const Route = createFileRoute("/professor/mensagens")({
  head: () => ({ meta: [{ title: "Mensagens — Professor" }] }),
  component: ProfessorMensagens,
});

type Mensagem = {
  id: string;
  de: "professor" | "aluno";
  nome: string;
  texto: string;
  hora: string;
};

type Conversa = {
  id: string;
  alunoNome: string;
  alunoEmail: string;
  turmaNome: string;
  mensagens: Mensagem[];
};

function horaAgora() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// Gera conversas mock para alunos das turmas do professor
function gerarConversas(turmas: Turma[], profNome: string): Conversa[] {
  const conversas: Conversa[] = [];
  turmas.forEach((t) => {
    (t.alunos ?? []).forEach((aluno) => {
      conversas.push({
        id: `${t.id}-${aluno.email}`,
        alunoNome: aluno.nome,
        alunoEmail: aluno.email,
        turmaNome: t.nome,
        mensagens: [
          {
            id: `msg-init-${aluno.email}`,
            de: "professor",
            nome: profNome,
            texto: `Olá, ${aluno.nome}! Esta é a área de mensagens da disciplina. Me chame quando precisar.`,
            hora: "08:00",
          },
        ],
      });
    });
  });
  return conversas;
}

function ProfessorMensagens() {
  const navigate = useNavigate();
  const [prof, setProf] = useState<ProfessorSession | null>(null);
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [ativa, setAtiva] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [filtro, setFiltro] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = store.getProfessor();
    if (!p) { navigate({ to: "/area-professor" }); return; }
    setProf(p);
    const ts = store.getTurmas().filter((t) => p.turmaIds.includes(t.id));
    const c = gerarConversas(ts, p.nome);
    setConversas(c);
    if (c.length > 0) setAtiva(c[0].id);
  }, [navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ativa, conversas]);

  const conversasFiltradas = useMemo(() => {
    if (!filtro) return conversas;
    const q = filtro.toLowerCase();
    return conversas.filter(
      (c) => c.alunoNome.toLowerCase().includes(q) || c.turmaNome.toLowerCase().includes(q),
    );
  }, [conversas, filtro]);

  function enviar() {
    if (!texto.trim() || !ativa || !prof) return;
    const nova: Mensagem = {
      id: `msg-${Date.now()}`,
      de: "professor",
      nome: prof.nome,
      texto: texto.trim(),
      hora: horaAgora(),
    };
    setConversas((prev) =>
      prev.map((c) => c.id === ativa ? { ...c, mensagens: [...c.mensagens, nova] } : c)
    );
    setTexto("");
  }

  const conversaAtiva = conversas.find((c) => c.id === ativa);

  if (!prof) return null;

  return (
    <PainelLayout
      perfil="professor"
      titulo={prof.nome}
      subtitulo={prof.disciplina}
      menu={MENU_PROFESSOR}
      onLogout={() => { store.logoutProfessor(); navigate({ to: "/" }); }}
    >
      <h1 className="mb-1 text-2xl font-extrabold text-foreground">Mensagens</h1>
      <p className="mb-6 text-sm text-muted-foreground">Converse individualmente com cada aluno das suas turmas.</p>

      {conversas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Nenhuma conversa disponível. Adicione alunos às suas turmas.</p>
        </div>
      ) : (
        <div
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
          style={{ height: "620px", display: "flex" }}
        >
          {/* Sidebar de contatos */}
          <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-secondary/30">
            <div className="border-b border-border p-3">
              <input
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                placeholder="Buscar aluno ou turma..."
                className="w-full rounded-lg border border-input bg-card px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="border-b border-border px-4 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> {conversasFiltradas.length} conversa(s)
              </p>
            </div>
            <nav className="flex-1 overflow-y-auto">
              {conversasFiltradas.length === 0 ? (
                <p className="p-4 text-center text-xs text-muted-foreground">Nenhum resultado.</p>
              ) : (
                conversasFiltradas.map((c) => {
                  const ultima = c.mensagens[c.mensagens.length - 1];
                  return (
                    <button
                      key={c.id}
                      onClick={() => setAtiva(c.id)}
                      className={`w-full border-b border-border px-4 py-3 text-left transition hover:bg-secondary/60 ${
                        ativa === c.id ? "bg-brand/5 border-l-2 border-l-brand" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                          {c.alunoNome.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{c.alunoNome}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{c.turmaNome}</p>
                        </div>
                      </div>
                      {ultima && (
                        <p className="mt-1 pl-9 text-[10px] text-muted-foreground/70 truncate italic">{ultima.texto}</p>
                      )}
                    </button>
                  );
                })
              )}
            </nav>
          </aside>

          {/* Chat */}
          <div className="flex min-w-0 flex-1 flex-col">
            {conversaAtiva ? (
              <>
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-border px-5 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                    {conversaAtiva.alunoNome.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{conversaAtiva.alunoNome}</p>
                    <p className="text-xs text-muted-foreground">{conversaAtiva.turmaNome}</p>
                  </div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                  {conversaAtiva.mensagens.map((msg) => {
                    const isProf = msg.de === "professor";
                    return (
                      <div key={msg.id} className={`flex ${isProf ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                            isProf
                              ? "bg-gradient-brand text-white rounded-br-sm"
                              : "bg-secondary text-foreground rounded-bl-sm"
                          }`}
                        >
                          <p>{msg.texto}</p>
                          <p className={`mt-1 text-[10px] ${isProf ? "text-white/70 text-right" : "text-muted-foreground"}`}>
                            {msg.hora}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="border-t border-border px-5 py-3">
                  <form
                    onSubmit={(e) => { e.preventDefault(); enviar(); }}
                    className="flex gap-2"
                  >
                    <input
                      value={texto}
                      onChange={(e) => setTexto(e.target.value)}
                      placeholder={`Mensagem para ${conversaAtiva.alunoNome}...`}
                      className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                      type="submit"
                      disabled={!texto.trim()}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-white shadow-brand transition hover:opacity-90 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground">Selecione uma conversa</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </PainelLayout>
  );
}
