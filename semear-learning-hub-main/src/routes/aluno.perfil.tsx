import { createFileRoute } from "@tanstack/react-router";
import { PainelPlaceholder } from "@/components/PainelPlaceholder";
import { store } from "@/lib/ies-store";
import { useState, useEffect } from "react";
import { GraduationCap, Calendar, Clock } from "lucide-react";

export const Route = createFileRoute("/aluno/perfil")({
  head: () => ({ meta: [{ title: "Perfil — Aluno" }] }),
  component: AlunoPerfil,
});

function AlunoPerfil() {
  const [aluno, setAluno] = useState(() => store.getAluno());

  useEffect(() => {
    if (!aluno) {
      setAluno(store.alunoPadrao());
    }
  }, [aluno]);

  if (!aluno) return null;

  return (
    <PainelPlaceholder perfil="aluno" titulo="Meu Perfil" descricao="Confira suas informações acadêmicas e de cadastro.">
      <div className="max-w-2xl rounded-2xl border border-border bg-card shadow-card p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-border">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand font-bold text-2xl">
            {aluno.nome.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{aluno.nome}</h2>
            <p className="text-sm text-muted-foreground">{aluno.email}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <GraduationCap className="h-5 w-5 text-brand mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Curso</span>
              <span className="text-base font-bold text-foreground">{aluno.curso}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-brand mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Turma</span>
              <span className="text-base font-bold text-foreground">
                {aluno.turmaNome || "Aguardando Turma (Fila de Espera)"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-brand mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Período Atual</span>
              <span className="text-base font-bold text-foreground">{aluno.periodo || "1º Período"}</span>
            </div>
          </div>
        </div>
      </div>
    </PainelPlaceholder>
  );
}
