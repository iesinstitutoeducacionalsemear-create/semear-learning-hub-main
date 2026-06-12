import { createFileRoute } from "@tanstack/react-router";
import { PainelPlaceholder } from "@/components/PainelPlaceholder";

export const Route = createFileRoute("/professor/materiais")({
  head: () => ({ meta: [{ title: "Materiais — Professor" }] }),
  component: () => <PainelPlaceholder perfil="professor" titulo="Materiais" descricao="Disponibilize materiais de apoio para suas turmas." />,
});
