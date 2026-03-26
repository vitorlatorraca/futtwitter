import { create } from "zustand";

interface SignupData {
  name: string;
  email: string;
  password: string;
  handle: string;
}

interface SignupStoreState {
  data: SignupData | null;
  setSignupData: (data: SignupData) => void;
  clearSignupData: () => void;
}

/**
 * Store transiente em memória para o fluxo multi-etapa:
 *   signup → selecionar-time → criação de conta
 *
 * Por que Zustand em vez de sessionStorage:
 *   - sessionStorage é acessível por qualquer JS na página (risco XSS)
 *   - O estado Zustand vive apenas no heap do JS — não persiste, não é
 *     acessível via DevTools → Application → Storage
 *   - Ao recarregar a página, o store zera automaticamente e o usuário
 *     é redirecionado de volta para o signup (comportamento correto)
 *
 * NÃO use persist() neste store — a persistência da senha seria um risco.
 */
export const useSignupStore = create<SignupStoreState>()((set) => ({
  data: null,
  setSignupData: (data) => set({ data }),
  clearSignupData: () => set({ data: null }),
}));
