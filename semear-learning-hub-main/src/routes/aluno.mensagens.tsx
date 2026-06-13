import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PainelLayout } from "@/components/PainelLayout";
import { MENU_ALUNO } from "@/lib/menus";
import { store, type AlunoSession } from "@/lib/ies-store";
import { MessageSquare, Send, User } from "lucide-react";

export const Route = createFileRoute("/aluno/mensagens")({
  head: () => ({ meta: [{ title: "Mensagens — Aluno" }] }),
  component: AlunoMensagens,
});

type Mensagem = {
  id: string;
  de: "aluno" | "professor";
  nome: string;
  texto: string;
  hora: string;
};

type Conversa = {
  id: string;
  professor: string;
  disciplina: string;
  mensagens: Mensagem[];
};

function horaAgora() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function AlunoMensagens() {
  const navigate = useNavigate();
  const [aluno, setAluno] = useState<AlunoSession | null>(null);
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [ativa, setAtiva] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const a = store.getAluno();
    if (!a) { navigate({ to: "/area-aluno" }); return; }
    setAluno(a);

    const turma = store.getTurmas().find((t) => t.id === a.turmaId);
    const disciplinas = turma?.disciplinas ?? [];

    // Gera conversas simuladas por disciplina
    const c: Conversa[] = disciplinas.map((disc, i) => ({
      id: `conv-${i}`,
      professor: "Prof. João Almeida",
      disciplina: disc,
      mensagens: [
        {
          id: `msg-${i}-1`,
          de: "professor",
          nome: "Prof. João Almeida",
          texto: `Olá, ${a.nome}! Bem-vindo(a) à disciplina ${disc}. Qualquer dúvida, estou à disposição.`,
          hora: "08:30",
        },
      ],
    }));
    setConversas(c);
    if (c.length > 0) setAtiva(c[0].id);
  }, [navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ativa, conversas]);

  function enviar() {
    if (!texto.trim() || !ativa || !aluno) return;
    const nova: Mensagem = {
      id: `msg-${Date.now()}`,
      de: "aluno",
      nome: aluno.nome,
      texto: texto.trim(),
      hora: horaAgora(),
    };
    setConversas((prev) =>
      prev.map((c) =>
        c.id === ativa ? { ...c, mensagens: [...c.mensagens, nova] } : c
      )
    );
    setTexto("");

    // Resposta automática simulada do professor
    setTimeout(() => {
      const resposta: Mensagem = {
        id: `msg-resp-${Date.now()}`,
        de: "professor",
        nome: "Prof. João Almeida",
        texto: "Obrigado pela mensagem! Responderei em breve.",
        hora: horaAgora(),
      };
      setConversas((prev) =>
        prev.map((c) =>
          c.id === ativa ? { ...c, mensagens: [...c.mensagens, resposta] } : c
        )
      );
    }, 1200);
  }

  const conversaAtiva = conversas.find((c) => c.id === ativa);

  if (!aluno) return null;

  return (
    <PainelLayout
      perfil="aluno"
      titulo={aluno.nome}
      subtitulo={`${aluno.curso} · ${aluno.turmaNome}`}
      menu={MENU_ALUNO}
      onLogout={() => { store.logoutAluno(); navigate({ to: "/" }); }}
    >
      <h1 className="mb-1 text-2xl font-extrabold text-foreground">Mensagens</h1>
      <p className="mb-6 text-sm text-muted-foreground">Converse com seus professores por disciplina.</p>

      {conversas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Nenhuma conversa disponível ainda.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card" style={{ height: "600px", display: "flex" }}>
          {/* Lista de conversas */}
          <aside className="w-64 shrink-0 border-r border-border bg-secondary/30">
            <div className="border-b border-border px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Conversas</p>
            </div>
            <nav className="overflow-y-auto">
              {conversas.map((c) => {
                const ultima = c.mensagens[c.mensagens.length - 1];
                return (
                  <button
                    key={c.id}
                    onClick={() => setAtiva(c.id)}
                    className={`w-full border-b border-border px-4 py-3 text-left transition hover:bg-secondary/60 ${ativa === c.id ? "bg-brand/5 border-l-2 border-l-brand" : ""}`}
                  >
                    <p className="text-xs font-bold text-foreground truncate">{c.disciplina}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">{c.professor}</p>
                    {ultima && (
                      <p className="mt-1 text-[11px] text-muted-foreground/70 truncate italic">{ultima.texto}</p>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Área de chat */}
          <div className="flex min-w-0 flex-1 flex-col">
            {conversaAtiva && (
              <>
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-border px-5 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{conversaAtiva.professor}</p>
                    <p className="text-xs text-muted-foreground">{conversaAtiva.disciplina}</p>
                  </div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto space-y-3 px-5 py-4">
                  {conversaAtiva.mensagens.map((msg) => {
                    const isAluno = msg.de === "aluno";
                    return (
                      <div key={msg.id} className={`flex ${isAluno ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${isAluno ? "bg-gradient-brand text-white rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}>
                          <p>{msg.texto}</p>
                          <p className={`mt-1 text-[10px] ${isAluno ? "text-white/70 text-right" : "text-muted-foreground"}`}>{msg.hora}</p>
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
                      placeholder="Escreva sua mensagem..."
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
            )}
          </div>
        </div>
      )}
    </PainelLayout>
  );
}
