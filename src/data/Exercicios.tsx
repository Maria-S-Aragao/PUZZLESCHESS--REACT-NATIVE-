import { JogoProps } from "../context/RenderizadorJogo";
import { PuzzleOne } from "./PuzzleOne";
import { PuzzleThree } from "./PuzzleThree";
import { PuzzleTwo } from "./PuzzleTwo";

export const Exercicios: (JogoProps & { id: number })[] = [
    {
        id: 1,
        exercicio: PuzzleOne(),
        linhas: 4,
        colunas: 2,
        nivel: 1,
        mate: 1, 
        corJogador: "branco",
        corAdversario: "preto",
    },

    {
        id: 2,
        exercicio: PuzzleTwo(),
        linhas: 4,
        colunas: 2,
        nivel: 2,
        mate: 1, 
        corJogador: "branco",
        corAdversario: "preto",
    },

    {
        id: 3,
        exercicio: PuzzleThree(),
        linhas: 4,
        colunas: 3,
        nivel: 3,
        mate: 1, 
        corJogador: "branco",
        corAdversario: "preto",
    },
]