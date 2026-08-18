/**
 * Lembra qual material a pessoa queria baixar quando esbarrou na exigência de
 * conta. Sem isso, quem cria conta cai na página inicial, no topo, e precisa
 * caçar o card de novo: é onde a maior parte desiste.
 *
 * Fica em localStorage (e não em sessionStorage) porque o link de entrada por
 * e-mail pode abrir em outra aba. Vale uma hora; depois disso, a pessoa já
 * esqueceu o que queria e um download surpresa só assusta.
 */

const CHAVE = 'escutaris:download-pendente';
const VALIDADE_MS = 60 * 60 * 1000;

export type DownloadPendente = {
  materialId: string;
  titulo: string;
  salvoEm: number;
};

export const guardarDownloadPendente = (materialId: string, titulo: string): void => {
  try {
    const dado: DownloadPendente = { materialId, titulo, salvoEm: Date.now() };
    localStorage.setItem(CHAVE, JSON.stringify(dado));
  } catch {
    // navegador com armazenamento bloqueado: a pessoa só perde a retomada
  }
};

export const lerDownloadPendente = (): DownloadPendente | null => {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return null;

    const dado = JSON.parse(bruto) as DownloadPendente;
    if (!dado?.materialId || Date.now() - dado.salvoEm > VALIDADE_MS) {
      localStorage.removeItem(CHAVE);
      return null;
    }
    return dado;
  } catch {
    return null;
  }
};

export const limparDownloadPendente = (): void => {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    // idem
  }
};
