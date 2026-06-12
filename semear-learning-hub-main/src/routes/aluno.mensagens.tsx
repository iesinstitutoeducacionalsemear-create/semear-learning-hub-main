import { createFileRoute } from "@tanstack/react-router";
import { PainelPlaceholder } from "@/components/PainelPlaceholder";

export const Route = createFileRoute("/aluno/mensagens")({
  head: () => ({ meta: [{ title: "Mensagens — Aluno" }] }),
  component: () => <PainelPlaceholder perfil="aluno" titulo="Mensagens" descricao="Mensagens dos seus professores e avisos da turma." />,
});
