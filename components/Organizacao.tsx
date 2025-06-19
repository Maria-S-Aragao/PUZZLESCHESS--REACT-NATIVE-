import { Peca } from "./Pecas";

export type Casa = {
  linha: number; 
  coluna: number; 
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

export type Posicao = {
    numero: number,
    jogadas: Jogada[],
    estado: 'inicial' | "andamento" | 'final'
};