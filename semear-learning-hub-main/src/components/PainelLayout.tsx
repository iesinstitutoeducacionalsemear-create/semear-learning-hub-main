import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Menu, X, LogOut } from "lucide-react";
import logo from "@/assets/ies-logo.asset.json";

export type PainelMenuItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type Props = {
  perfil: "aluno" | "professor" | "admin";
  titulo: string;
  subtitulo?: string;
  menu: PainelMenuItem[];
  onLogout?: () => void;
  children: ReactNode;
};

export function PainelLayout({ perfil, titulo, subtitulo, menu, onLogout, children }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const pathname = router.state.location.pathname;

  const badge =
    perfil === "aluno" ? "Área do Aluno" : perfil === "professor" ? "Área do Professor" : "Painel Admin";

  return (
    <div className="flex min-h-screen bg-secondary/40">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-border bg-card transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <Link to="/" className="flex items-center gap-2 border-b border-border px-5 py-4">
            <img src={logo.url} alt="IES" className="h-9 w-auto" />
          </Link>

          <div className="border-b border-border px-5 py-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-light">{badge}</div>
            <div className="mt-1 text-base font-bold text-foreground">{titulo}</div>
            {subtitulo && <div className="text-xs text-muted-foreground">{subtitulo}</div>}
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {menu.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-gradient-brand text-brand-foreground shadow-brand"
                      : "text-foreground/75 hover:bg-secondary hover:text-brand"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 border-t border-border px-5 py-4 text-sm font-medium text-foreground/75 hover:bg-secondary hover:text-destructive"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          )}
        </div>
      </aside>

      {open && (
        <button
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-foreground/40 lg:hidden"
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:px-6">
          <button
            className="rounded-md p-2 text-brand lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="text-sm font-semibold text-foreground">{badge}</div>
          <Link to="/" className="text-xs text-muted-foreground hover:text-brand">
            ← Voltar ao site
          </Link>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
