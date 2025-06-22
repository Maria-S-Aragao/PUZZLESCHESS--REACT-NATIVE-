import { Exercicio } from "../types/Exercicio";
import { Lance } from "../types/Lance";
import { Posicao } from "../types/Posicao";
import { PosicaoInicial } from "../types/PosicaoInicial";
import * as Pecas from '../constants/Pecas';

export function ContrucaoPuzzleOne(): Exercicio {
    //Peças que serão utilizadas no exercício
    const { reiPreto, damaBranca, torrePreta } = Pecas;

    //Quais as peças que serão iniciadas no tabuleiro
    const posicaoInicial: PosicaoInicial[] = [
        { casa: { linha: 3, coluna: 0 }, peca: damaBranca },
        { casa: { linha: 0, coluna: 1 }, peca: reiPreto },
        { casa: { linha: 0, coluna: 0 }, peca: torrePreta }
    ];

    //São os lances possíveis de serem feitos e as respostas correspondentes
    const PrimeiroLanceDama: Lance[] = [
        {
            casa_inicial: { linha: 3, coluna: 0 },
            casa_final: { linha: 3, coluna: 1 },
            acao: "xeque",
            resposta: {
                peca: reiPreto,
                casa_inicial: { linha: 0, coluna: 1 },
                casa_final: { linha: 1, coluna: 0 },
                acao: "movimentacao"
            },
            finalizacao: "perdeu",
            capturas: false
        },

        {
            casa_inicial: { linha: 3, coluna: 0 },
            casa_final: { linha: 2, coluna: 0 },
            acao: "movimentacao",
            resposta: {
                peca: torrePreta,
                casa_inicial: { linha: 0, coluna: 0 },
                casa_final: { linha: 2, coluna: 0 },
                acao: "captura"
            },
            finalizacao: "perdeu",
            capturas: false
        },

        {
            casa_inicial: { linha: 3, coluna: 0 },
            casa_final: { linha: 1, coluna: 0 },
            acao: "movimentacao",
            resposta: {
                peca: torrePreta,
                casa_inicial: { linha: 0, coluna: 0 },
                casa_final: { linha: 1, coluna: 0 },
                acao: "captura"
            },
            finalizacao: "perdeu",
            capturas: false
        },

        {
            casa_inicial: { linha: 3, coluna: 0 },
            casa_final: { linha: 0, coluna: 0 },
            acao: "captura-xeque",
            resposta: {
                peca: reiPreto,
                casa_inicial: { linha: 0, coluna: 1 },
                casa_final: { linha: 0, coluna: 0 },
                acao: "captura"
            },
            finalizacao: "perdeu",
            capturas: true
        },

        {
            casa_inicial: { linha: 3, coluna: 0 },
            casa_final: { linha: 2, coluna: 1 },
            acao: "mate",
            finalizacao: "ganhou",
            capturas: false
        },
    ]

    //Basicamente a posição, podendo ter várias jogadas com diversas peças
    const Jogadas: Posicao[] = [
        {
            numero: 1,
            jogadas: [{peca: damaBranca, lances: PrimeiroLanceDama}],
            estado: "final"
        }
    ] 

    const exercicioPronto: Exercicio = {
        posicaoInicial: posicaoInicial,
        posicoes: Jogadas
    }

    return exercicioPronto;
}