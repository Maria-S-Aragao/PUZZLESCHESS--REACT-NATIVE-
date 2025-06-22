import { Jogada } from "./Jogada";

export type Posicao = {
    numero: number,
    jogadas: Jogada[],
    estado: "andamento" | 'final'
};