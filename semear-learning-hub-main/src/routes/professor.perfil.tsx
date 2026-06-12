import { createFileRoute } from "@tanstack/react-router";
import { PainelPlaceholder } from "@/components/PainelPlaceholder";

export const Route = createFileRoute("/professor/perfil")({
  head: () => ({ meta: [{ title: "Perfil — Professor" }] }),
  component: () => <PainelPlaceholder perfil="professor" titulo="Perfil" descricao="Atualize seus dados, foto e contato." />,
});
