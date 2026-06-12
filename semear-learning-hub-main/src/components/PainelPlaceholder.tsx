import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PainelLayout, type PainelMenuItem } from "@/components/PainelLayout";
import { store, type ProfessorSession, type AlunoSession } from "@/lib/ies-store";
import { MENU_PROFESSOR, MENU_ALUNO } from "@/lib/menus";

type Props = {
  perfil: "professor" | "aluno";
  titulo: string;
  descricao: string;
  children?: React.ReactNode;
};

export function PainelPlaceholder({ perfil, titulo, descricao, children }: Props) {
  const navigate = useNavigate();
  const [sessao, setSessao] = useState<ProfessorSession | AlunoSession | null>(null);

  useEffect(() => {
    if (perfil === "professor") {
      const p = store.getProfessor();
      if (!p) { navigate({ to: "/area-professor" }); return; }
      setSessao(p);
    } else {
      const a = store.getAluno();
      if (!a) { navigate({ to: "/area-aluno" }); return; }
      setSessao(a);
    }
  }, [navigate, perfil]);

  if (!sessao) return null;

  const subtitulo = perfil === "professor"
    ? (sessao as ProfessorSession).disciplina
    : `${(sessao as AlunoSession).curso} · ${(sessao as AlunoSession).turmaNome}`;

  return (
    <PainelLayout
      perfil={perfil}
      titulo={sessao.nome}
      subtitulo={subtitulo}
      menu={perfil === "professor" ? MENU_PROFESSOR : MENU_ALUNO}
      onLogout={() => {
        perfil === "professor" ? store.logoutProfessor() : store.logoutAluno();
        navigate({ to: "/" });
      }}
    >
      <h1 className="mb-2 text-2xl font-extrabold text-foreground">{titulo}</h1>
      <p className="mb-6 text-sm text-muted-foreground">{descricao}</p>
      {children ?? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-card">
          <p className="text-sm text-muted-foreground">
            Esta seção fará parte da próxima fase, quando o backend (Lovable Cloud) for ativado.
          </p>
        </div>
      )}
    </PainelLayout>
  );
}
