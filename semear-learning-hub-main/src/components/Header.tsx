import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/ies-logo.asset.json";

const nav = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Sobre" },
  { to: "/cursos", label: "Cursos" },
  { to: "/professores", label: "Professores" },
  { to: "/contato", label: "Contato" },
  { to: "/area-aluno", label: "Área do Aluno" },
  { to: "/area-professor", label: "Área do Professor" },
  { to: "/admin/turmas", label: "Admin" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
          <img src={logo.url} alt="Instituto Educacional Semear" className="h-10 w-auto md:h-12" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/75 transition hover:bg-secondary hover:text-brand data-[status=active]:bg-secondary data-[status=active]:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/area-aluno"
          className="hidden rounded-full bg-gradient-brand px-5 py-2 text-sm font-semibold text-brand-foreground shadow-brand transition hover:opacity-90 lg:inline-flex"
        >
          Entrar
        </Link>

        <button
          aria-label="Abrir menu"
          className="rounded-md p-2 text-brand lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-brand data-[status=active]:bg-secondary data-[status=active]:text-brand"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
