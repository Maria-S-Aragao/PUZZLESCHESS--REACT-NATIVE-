import { Casa } from "../types/Casa";
import { EstadoTabuleiro } from "../types/EstadoTabuleiro";
import { PosicaoInicial } from "../types/PosicaoInicial";

//Função que recebe uma Casa e retorna em string pra outras funções conseguirem usar mais facilmente.
export function casaToString(casa: Casa): string {
    return `${casa.linha}-${casa.coluna}`;
}

export function encontrarPeca(tabuleiro: Map<string, PosicaoInicial>, casa: Casa): PosicaoInicial | undefined {
    const chave = casaToString(casa);
    return tabuleiro.get(chave);
}

export function posicaoToEstadoTabuleiro(posicoes: PosicaoInicial[]): Map<string, PosicaoInicial> {
  const estado = new Map<string, PosicaoInicial>();
  posicoes.forEach(pos => {
    const chave = casaToString(pos.casa);
    estado.set(chave, pos);
  });
  return estado;
}


