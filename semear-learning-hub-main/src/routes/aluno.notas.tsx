import { createFileRoute } from "@tanstack/react-router";
import { PainelPlaceholder } from "@/components/PainelPlaceholder";

export const Route = createFileRoute("/aluno/notas")({
  head: () => ({ meta: [{ title: "Notas — Aluno" }] }),
  component: () => <PainelPlaceholder perfil="aluno" titulo="Notas" descricao="Acompanhe suas notas por disciplina." />,
});
