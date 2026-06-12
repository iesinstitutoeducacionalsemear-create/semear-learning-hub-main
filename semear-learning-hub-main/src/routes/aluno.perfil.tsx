import { createFileRoute } from "@tanstack/react-router";
import { PainelPlaceholder } from "@/components/PainelPlaceholder";

export const Route = createFileRoute("/aluno/perfil")({
  head: () => ({ meta: [{ title: "Perfil — Aluno" }] }),
  component: () => <PainelPlaceholder perfil="aluno" titulo="Perfil" descricao="Atualize seus dados pessoais e de contato." />,
});
