import { Casa } from "../types/Casa";

// Versão que retorna Map diretamente
export function GeradorTabuleiroMap(linhas: number, colunas: number): Map<string, Casa> {
  const tabuleiro = new Map<string, Casa>();

  for (let linha = 0; linha < linhas; linha++) {
    for (let coluna = 0; coluna < colunas; coluna++) {
      const casa: Casa = { linha, coluna };
      const chave = `${linha}-${coluna}`;
      tabuleiro.set(chave, casa);
    }
  }

  return tabuleiro;
}

// Se você ainda precisar da versão matriz para renderização
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

// Versão híbrida que retorna ambos
export function GeradorTabuleiroCompleto(linhas: number, colunas: number) {
  const grid: Casa[][] = [];
  const map = new Map<string, Casa>();

  for (let linha = 0; linha < linhas; linha++) {
    const linhaCasas: Casa[] = [];

    for (let coluna = 0; coluna < colunas; coluna++) {
      const casa: Casa = { linha, coluna };
      
      // Adiciona ao grid
      linhaCasas.push(casa);
      
      // Adiciona ao map
      const chave = `${linha}-${coluna}`;
      map.set(chave, casa);
    }

    grid.push(linhaCasas);
  }

  return { grid, map };
}