import { createFileRoute } from "@tanstack/react-router";
import { PainelPlaceholder } from "@/components/PainelPlaceholder";

export const Route = createFileRoute("/professor/mensagens")({
  head: () => ({ meta: [{ title: "Mensagens — Professor" }] }),
  component: () => <PainelPlaceholder perfil="professor" titulo="Mensagens" descricao="Converse com alunos e envie comunicados às turmas." />,
});
