import { Casa } from "../types/Casa";

export function GeradorTabuleiroGrid(linhas: number, colunas: number): Casa[][] {
  const tabuleiro: Casa[][] = [];

  for (let linha = 0; linha < linhas; linha++) {
    const linhaCasas: Casa[] = [];

    for (let coluna = 0; coluna < colunas; coluna++) {
      linhaCasas.push({
        linha,
        coluna
      });
    }

    tabuleiro.push(linhaCasas);
  }

  return tabuleiro;
}

