import { Acao } from "./Acao";
import { Casa } from "./Casa";
import { Peca } from "./Peca";

export type Resposta = {
    peca: Peca,
    casa_inicial: Casa,
    casa_final: Casa,
    acao: Acao
};