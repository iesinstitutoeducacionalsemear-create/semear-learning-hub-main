import { createFileRoute } from "@tanstack/react-router";
import { PainelPlaceholder } from "@/components/PainelPlaceholder";

export const Route = createFileRoute("/aluno/frequencia")({
  head: () => ({ meta: [{ title: "Frequência — Aluno" }] }),
  component: () => <PainelPlaceholder perfil="aluno" titulo="Frequência" descricao="Veja sua frequência registrada por disciplina." />,
});
