import { createFileRoute } from "@tanstack/react-router";
import { PainelPlaceholder } from "@/components/PainelPlaceholder";

export const Route = createFileRoute("/aluno/materiais")({
  head: () => ({ meta: [{ title: "Materiais — Aluno" }] }),
  component: () => <PainelPlaceholder perfil="aluno" titulo="Materiais" descricao="Materiais de apoio publicados pelos professores da sua turma." />,
});
