import { Casa, Acao, Resposta, Lance, Jogada, PosicaoInicial, Posicao, Exercicio } from "../Organizacao";
import { Pecas } from "../Pecas";

export function PuzzleTwo(): Exercicio {
  const {
    reiBranco,
    damaBranca,
    peaoBranco,
    reiPreto,
    peaoPreto,
    cavaloPreto
  } = Pecas();

  // Posições iniciais
  const posicaoInicial: PosicaoInicial[] = [
    { casa: { linha: 6, coluna: 4 }, peca: peaoBranco },
    { casa: { linha: 7, coluna: 3 }, peca: damaBranca },
    { casa: { linha: 1, coluna: 4 }, peca: peaoPreto },
    { casa: { linha: 0, coluna: 4 }, peca: reiPreto },
    { casa: { linha: 0, coluna: 2 }, peca: cavaloPreto }
  ];

  // Jogada 1: com o peão branco
  const jogadaPeao: Jogada = {
    peca: peaoBranco,
    lances: [
      {
        casa_inicial: { linha: 6, coluna: 4 },
        casa_final: { linha: 5, coluna: 4 },
        acao: "movimentacao",
        resposta: {
          peca: peaoPreto,
          casa_inicial: { linha: 1, coluna: 4 },
          casa_final: { linha: 2, coluna: 4 },
          acao: "movimentacao"
        }
      },
      {
        casa_inicial: { linha: 5, coluna: 4 },
        casa_final: { linha: 4, coluna: 4 },
        acao: "movimentacao",
        resposta: {
          peca: cavaloPreto,
          casa_inicial: { linha: 0, coluna: 2 },
          casa_final: { linha: 2, coluna: 3 },
          acao: "movimentacao"
        }
      }
    ]
  };

  // Jogada 2: com a dama branca
  const jogadaDama: Jogada = {
    peca: damaBranca,
    lances: [
      {
        casa_inicial: { linha: 7, coluna: 3 },
        casa_final: { linha: 3, coluna: 3 },
        acao: "movimentacao",
        resposta: {
          peca: reiPreto,
          casa_inicial: { linha: 0, coluna: 4 },
          casa_final: { linha: 1, coluna: 4 },
          acao: "movimentacao"
        }
      },
      {
        casa_inicial: { linha: 3, coluna: 3 },
        casa_final: { linha: 1, coluna: 4 },
        acao: "captura-mate",
        finalizacao: "ganhou"
      }
    ]
  };

  const posicao1: Posicao = {
    numero: 1,
    jogadas: [jogadaPeao, jogadaDama],
    estado: "andamento"
  };

  const exercicio: Exercicio = {
    posicaoInicial,
    posicoes: [posicao1]
  };

  return exercicio;
}
