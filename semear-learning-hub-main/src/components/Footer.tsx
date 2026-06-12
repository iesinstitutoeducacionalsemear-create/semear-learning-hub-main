import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react";
import logo from "@/assets/ies-logo.asset.json";

export function Footer() {
  return (
    <footer className="mt-24 bg-brand text-brand-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <div className="inline-flex rounded-xl bg-white px-3 py-2">
            <img src={logo.url} alt="Instituto Educacional Semear" className="h-10 w-auto" />
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
            O Instituto Educacional Semear (IES) é uma instituição comprometida com a
            transformação social por meio da educação de qualidade, formando profissionais
            preparados para fazer a diferença.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="Instagram" className="rounded-full bg-white/10 p-2 hover:bg-white/20"><Instagram className="h-5 w-5" /></a>
            <a href="#" aria-label="Facebook" className="rounded-full bg-white/10 p-2 hover:bg-white/20"><Facebook className="h-5 w-5" /></a>
            <a href="https://wa.me/5500000000000" aria-label="WhatsApp" className="rounded-full bg-white/10 p-2 hover:bg-white/20"><MessageCircle className="h-5 w-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Navegação</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><Link to="/" className="hover:text-white">Início</Link></li>
            <li><Link to="/sobre" className="hover:text-white">Sobre</Link></li>
            <li><Link to="/cursos" className="hover:text-white">Cursos</Link></li>
            <li><Link to="/professores" className="hover:text-white">Professores</Link></li>
            <li><Link to="/contato" className="hover:text-white">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Contato</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" /> Av. Principal, 1000 — Centro</li>
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" /> (00) 0000-0000</li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" /> contato@iessemear.edu.br</li>
            <li className="flex items-start gap-2"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" /> WhatsApp: (00) 90000-0000</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/70 md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} Instituto Educacional Semear — IES. Todos os direitos reservados.</p>
          <p>Transformando vidas através da educação.</p>
        </div>
      </div>
    </footer>
  );
}
