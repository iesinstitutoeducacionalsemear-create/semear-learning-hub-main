import { createFileRoute } from "@tanstack/react-router";
import { PainelPlaceholder } from "@/components/PainelPlaceholder";

export const Route = createFileRoute("/professor/notas")({
  head: () => ({ meta: [{ title: "Notas — Professor" }] }),
  component: () => <PainelPlaceholder perfil="professor" titulo="Notas" descricao="Consolide notas das atividades e avaliações por turma." />,
});
