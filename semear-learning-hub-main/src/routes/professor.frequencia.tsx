import { createFileRoute } from "@tanstack/react-router";
import { PainelPlaceholder } from "@/components/PainelPlaceholder";

export const Route = createFileRoute("/professor/frequencia")({
  head: () => ({ meta: [{ title: "Frequência — Professor" }] }),
  component: () => <PainelPlaceholder perfil="professor" titulo="Frequência" descricao="Registre presença e acompanhe a frequência por turma." />,
});
