import { Acao } from "./Acao";
import { Casa } from "./Casa";
import { Resposta } from "./Resposta";

export type Lance = {
    capturas: boolean;
    casa_inicial: Casa,
    casa_final: Casa,
    acao: Acao,
    resposta?: Resposta,
    finalizacao?: 'perdeu' | 'ganhou'
};