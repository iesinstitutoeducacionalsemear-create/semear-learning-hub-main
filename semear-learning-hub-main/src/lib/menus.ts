import { LayoutDashboard, Users, FileText, FolderOpen, ClipboardCheck, GraduationCap, MessageSquare, User, BookOpen, CalendarCheck, Award } from "lucide-react";
import type { PainelMenuItem } from "@/components/PainelLayout";

export const MENU_PROFESSOR: PainelMenuItem[] = [
  { to: "/professor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/professor/turmas", label: "Minhas Turmas", icon: Users },
  { to: "/professor/atividades", label: "Atividades", icon: FileText },
  { to: "/professor/materiais", label: "Materiais", icon: FolderOpen },
  { to: "/professor/frequencia", label: "Frequência", icon: ClipboardCheck },
  { to: "/professor/notas", label: "Notas", icon: GraduationCap },
  { to: "/professor/mensagens", label: "Mensagens", icon: MessageSquare },
  { to: "/professor/perfil", label: "Perfil", icon: User },
];

export const MENU_ALUNO: PainelMenuItem[] = [
  { to: "/aluno/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/aluno/disciplinas", label: "Minhas Disciplinas", icon: BookOpen },
  { to: "/aluno/atividades", label: "Atividades", icon: FileText },
  { to: "/aluno/materiais", label: "Materiais", icon: FolderOpen },
  { to: "/aluno/notas", label: "Notas", icon: Award },
  { to: "/aluno/frequencia", label: "Frequência", icon: CalendarCheck },
  { to: "/aluno/mensagens", label: "Mensagens", icon: MessageSquare },
  { to: "/aluno/perfil", label: "Perfil", icon: User },
];
