// Mock data store backed by localStorage. Em produção, virá da Lovable Cloud.

export type Turma = {
  id: string;
  curso: string;
  nome: string;
  ano: number;
  semestre: number;
  disciplinas?: string[];
};

export type AlunoSession = {
  nome: string;
  email: string;
  curso: string;
  turmaId: string;
  turmaNome: string;
};

export type ProfessorSession = {
  nome: string;
  email: string;
  turmaIds: string[];
  disciplina: string;
};

export type Atividade = {
  id: string;
  turmaId: string;
  professorNome: string;
  professorEmail: string;
  disciplina: string;
  titulo: string;
  descricao: string;
  instrucoes: string;
  anexoNome?: string;
  dataPublicacao: string; // ISO date
  prazo: string; // ISO date
  pontuacaoMax: number;
  criadaEm: string; // ISO datetime
};

export type Entrega = {
  id: string;
  atividadeId: string;
  alunoEmail: string;
  alunoNome: string;
  enviadaEm: string;
  arquivoNome?: string;
  nota?: number;
  observacao?: string;
  corrigida?: boolean;
};

export const TURMAS_PADRAO: Turma[] = [
  { id: "ped-2024-2", curso: "Pedagogia", nome: "Pedagogia 2024.2", ano: 2024, semestre: 2, disciplinas: ["Didática Geral", "Psicologia da Educação", "Estágio Supervisionado II"] },
  { id: "ped-2025-1", curso: "Pedagogia", nome: "Pedagogia 2025.1", ano: 2025, semestre: 1, disciplinas: ["Fundamentos da Educação", "Sociologia da Educação", "Língua Portuguesa"] },
  { id: "ped-2026-1", curso: "Pedagogia", nome: "Pedagogia 2026.1", ano: 2026, semestre: 1, disciplinas: ["Introdução à Pedagogia", "Filosofia da Educação", "Metodologia Científica"] },
];

const KEYS = {
  turmas: "ies_turmas",
  atividades: "ies_atividades",
  entregas: "ies_entregas",
  aluno: "ies_aluno_demo",
  professor: "ies_professor_demo",
} as const;

function isBrowser() {
  return typeof window !== "undefined";
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const store = {
  getTurmas(): Turma[] {
    const t = read<Turma[]>(KEYS.turmas, []);
    return t.length ? t : TURMAS_PADRAO;
  },
  saveTurmas(t: Turma[]) {
    write(KEYS.turmas, t);
  },

  getAtividades(): Atividade[] {
    return read<Atividade[]>(KEYS.atividades, []);
  },
  saveAtividade(a: Atividade) {
    const all = store.getAtividades();
    all.unshift(a);
    write(KEYS.atividades, all);
  },

  getEntregas(): Entrega[] {
    return read<Entrega[]>(KEYS.entregas, []);
  },
  saveEntrega(e: Entrega) {
    const all = store.getEntregas();
    const idx = all.findIndex((x) => x.atividadeId === e.atividadeId && x.alunoEmail === e.alunoEmail);
    if (idx >= 0) all[idx] = { ...all[idx], ...e };
    else all.push(e);
    write(KEYS.entregas, all);
  },
  updateEntrega(id: string, patch: Partial<Entrega>) {
    const all = store.getEntregas();
    const idx = all.findIndex((x) => x.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...patch };
      write(KEYS.entregas, all);
    }
  },

  getAluno(): AlunoSession | null {
    return read<AlunoSession | null>(KEYS.aluno, null);
  },
  setAluno(a: AlunoSession) {
    write(KEYS.aluno, a);
  },
  logoutAluno() {
    if (isBrowser()) localStorage.removeItem(KEYS.aluno);
  },

  getProfessor(): ProfessorSession | null {
    return read<ProfessorSession | null>(KEYS.professor, null);
  },
  setProfessor(p: ProfessorSession) {
    write(KEYS.professor, p);
  },
  logoutProfessor() {
    if (isBrowser()) localStorage.removeItem(KEYS.professor);
  },

  professorPadrao(): ProfessorSession {
    return {
      nome: "Prof. João Almeida",
      email: "joao@ies.edu.br",
      turmaIds: ["ped-2025-1", "ped-2026-1"],
      disciplina: "Fundamentos da Educação",
    };
  },
  alunoPadrao(): AlunoSession {
    return {
      nome: "Maria Silva",
      email: "maria@ies.edu.br",
      curso: "Pedagogia",
      turmaId: "ped-2026-1",
      turmaNome: "Pedagogia 2026.1",
    };
  },
};

export function fmtData(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR");
  } catch {
    return iso;
  }
}

export function fmtDataHora(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}
