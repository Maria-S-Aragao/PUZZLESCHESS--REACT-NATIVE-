import { Peca } from "./Pecas";

export type Casa = {
  linha: number; 
  coluna: number; 
  peca?: Peca
};

export type Acao =
  | 'movimentacao'
  | 'captura'
  | 'xeque'
  | 'mate'
  | 'captura-xeque'
  | 'captura-mate'
  | 'captura-xeque-mate';

export type Resposta = {
    peca: Peca,
    casa_inicial: Casa,
    casa_final: Casa,
    acao: Acao
};

export type Lance = {
    capturas: boolean;
    casa_inicial: Casa,
    casa_final: Casa,
    acao: Acao,
    resposta?: Resposta,
    finalizacao?: 'perdeu' | 'ganhou'
};

export type Jogada = {
    peca: Peca,
    lances: Lance[]
};

export type PosicaoInicial = {
    casa: Casa,
    peca: Peca
}

export type Posicao = {
    numero: number,
    jogadas: Jogada[],
    estado: "andamento" | 'final'
};

export type Exercicio = {
    posicaoInicial: PosicaoInicial[],
    posicoes: Posicao[]
}