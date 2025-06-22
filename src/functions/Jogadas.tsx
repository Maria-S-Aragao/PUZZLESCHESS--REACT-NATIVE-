import { Casa } from "../types/Casa";
import { Jogada } from "../types/Jogada";
import { Lance } from "../types/Lance";

export function obterJogadasDaPecaSelecionada(pecaSelecionada: Casa | null, posicaoAtual: { jogadas: Jogada[] } | undefined ): Jogada[] {
    if (!pecaSelecionada || !posicaoAtual) return [];

    return posicaoAtual.jogadas.filter(jogada =>
        jogada.lances.some(lance =>
            lance.casa_inicial.linha === pecaSelecionada.linha &&
            lance.casa_inicial.coluna === pecaSelecionada.coluna
        )
    );
}

export function obterLancesDasJogadas(jogadas: Jogada[]): Lance[] {
    return jogadas.flatMap(jogada => jogada.lances);
}

export function ehCasaDestinoPossivel(casa: Casa, lances: Lance[]): boolean {
    return lances.some(
        lance => lance.casa_final.linha === casa.linha &&
            lance.casa_final.coluna === casa.coluna
    );
}
