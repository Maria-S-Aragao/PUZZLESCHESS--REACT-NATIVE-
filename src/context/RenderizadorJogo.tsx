
import { useCallback, useEffect, useMemo, useState } from "react";
import { Casa } from "../types/Casa";
import { Exercicio } from "../types/Exercicio";
import { EstadoTabuleiro } from "../types/EstadoTabuleiro"
import { casaToString, encontrarPeca, posicaoToEstadoTabuleiro } from "../util/TabuleiroUtils";
import { StatusJogo } from "../types/StatusJogo";
import { GeradorTabuleiroGrid } from "../functions/GeradorTabuleiro";
import { Lance } from "../types/Lance";
import { TouchableOpacity, View, Image, Text, Dimensions } from "react-native";
import { ehCasaDestinoPossivel, obterLancesDasJogadas } from "../functions/Jogadas";
import { Jogada } from "../types/Jogada";
import { styles } from "./Jogo.styles";
import { Peca } from "../types/Peca";
import * as Pecas from "../constants/Pecas"
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { StyleSheet } from "react-native";

interface JogoProps {
    exercicio: Exercicio;
    linhas: number;
    colunas: number;
    nivel: string,
    mate: string,
    corJogador: "branco" | "preto",
    corAdversario: "branco" | "preto"
}

export function Jogo({ exercicio, linhas, colunas, nivel, mate, corAdversario, corJogador }: JogoProps) {
    //Aqui é uma atualização do tamanho das casas e tabuleiro, caso ele tenha que ser maior
    const { width, height } = Dimensions.get('window');
    const tamanhoTabuleiro = Math.min(width * 0.95, height * 0.5);
    const tamanhoCasa = tamanhoTabuleiro / Math.max(linhas, colunas);

    const estilosDinamicos = StyleSheet.create({
        casa: {
            width: tamanhoCasa,
            height: tamanhoCasa,
            justifyContent: 'center',
            alignItems: 'center',
        },
        linha: {
            flexDirection: 'row',
        },
        tabuleiroContainer: {
            width: tamanhoTabuleiro,
            height: tamanhoTabuleiro,
            alignSelf: 'center',
            justifyContent: "center"
        },
    });

    const [tabuleiro, setTabuleiro] = useState<EstadoTabuleiro>(new Map());
    const [pecaSelecionada, setPecaSelecionada] = useState<Casa | null>(null);
    const [statusJogo, setStatusJogo] = useState<StatusJogo>('jogando');
    const [indiceJogada, setIndiceJogada] = useState(0);
    const [historico, setHistorico] = useState<EstadoTabuleiro[]>([]);
    const [reiDerrotado, setReiDerrotado] = useState<{ cor: 'branco' | 'preto' } | null>(null);

    const tabuleiroGrid = useMemo(() => GeradorTabuleiroGrid(linhas, colunas), [linhas, colunas]);

    const encontrarPecaCallback = useCallback((casa: Casa) => encontrarPeca(tabuleiro, casa), [tabuleiro]);

    const posicaoAtual = useMemo(() => exercicio.posicoes[indiceJogada], [exercicio.posicoes, indiceJogada]);

    const copiarTabuleiro = useCallback((origem: EstadoTabuleiro): EstadoTabuleiro => { return new Map(origem); }, []);

    const podeVoltarLance = historico.length > 1 && statusJogo === 'jogando';


    const obterImagemPeca = useCallback((peca: Peca): any => {

        if (reiDerrotado && peca.nome === 'rei' && peca.cor === reiDerrotado.cor) {
            if (peca.cor === 'branco') {
                return Pecas.ReiBrancoMorto.imagem;
            } else if (peca.cor === 'preto') {
                return Pecas.ReiPretoMorto.imagem;
            }
        }

        return peca.imagem;
    }, [reiDerrotado]);

    useEffect(() => {
        iniciarOuResetarJogo();
    }, [exercicio.posicaoInicial, exercicio.posicoes]);

    const iniciarOuResetarJogo = useCallback(() => {
        const estadoInicial = posicaoToEstadoTabuleiro(exercicio.posicaoInicial);
        setTabuleiro(estadoInicial);
        setHistorico([estadoInicial]);
        setIndiceJogada(0);
        setStatusJogo('jogando');
        setPecaSelecionada(null);
        setReiDerrotado(null); // Reset do rei derrotado
    }, [exercicio.posicaoInicial]);

    const executarResposta = useCallback((
        novoTabuleiro: EstadoTabuleiro,
        resposta: Lance['resposta']
    ): void => {
        if (!resposta) return;

        const chaveInicial = casaToString(resposta.casa_inicial);
        const chaveFinal = casaToString(resposta.casa_final);

        // Remove peça da casa inicial
        novoTabuleiro.delete(chaveInicial);

        // Remove peça capturada na casa final (se houver)
        if (novoTabuleiro.has(chaveFinal)) {
            novoTabuleiro.delete(chaveFinal);
        }

        // Adiciona peça na casa final
        novoTabuleiro.set(chaveFinal, {
            casa: resposta.casa_final,
            peca: resposta.peca
        });
    }, []);

    const atualizarStatusJogo = useCallback((finalizacao?: Lance['finalizacao']): void => {
        if (finalizacao === 'ganhou') {
            setStatusJogo('ganhou');
            setReiDerrotado({ cor: corAdversario });
        } else if (finalizacao === 'perdeu') {
            setStatusJogo('perdeu');
            setReiDerrotado({ cor: corJogador });
        } else {
            setStatusJogo('jogando');
            setReiDerrotado(null);
        }
    }, []);

    const moverPecaPara = useCallback((casaDestino: Casa) => {
        if (!pecaSelecionada || statusJogo !== 'jogando') return;

        const lancesPossiveis = obterLancesDasJogadas(posicaoAtual.jogadas);

        const lance = lancesPossiveis.find(
            l => l.casa_final.linha === casaDestino.linha &&
                l.casa_final.coluna === casaDestino.coluna
        );

        if (!lance) {
            return;
        }

        const pecaAtual = encontrarPecaCallback(pecaSelecionada);
        if (!pecaAtual) return;

        const novoTabuleiro = copiarTabuleiro(tabuleiro);

        const chaveInicial = casaToString(pecaSelecionada);
        novoTabuleiro.delete(chaveInicial);

        const chaveFinal = casaToString(casaDestino);
        if (novoTabuleiro.has(chaveFinal)) {
            novoTabuleiro.delete(chaveFinal);
        }

        novoTabuleiro.set(chaveFinal, {
            casa: casaDestino,
            peca: pecaAtual.peca
        });

        executarResposta(novoTabuleiro, lance.resposta);
        setTabuleiro(novoTabuleiro);
        setHistorico(prev => [...prev, novoTabuleiro]);
        setPecaSelecionada(null);
        setIndiceJogada(prev => prev + 1);
        atualizarStatusJogo(lance.finalizacao);
    }, [
        pecaSelecionada,
        statusJogo,
        posicaoAtual,
        encontrarPecaCallback,
        copiarTabuleiro,
        tabuleiro,
        executarResposta,
        atualizarStatusJogo
    ]);

    const jogadasDaPecaSelecionada = useMemo((): Jogada[] => {
        if (!pecaSelecionada || !posicaoAtual) return [];

        return posicaoAtual.jogadas.filter(jogada =>
            jogada.lances.some(lance =>
                lance.casa_inicial.linha === pecaSelecionada.linha &&
                lance.casa_inicial.coluna === pecaSelecionada.coluna
            )
        );
    }, [pecaSelecionada, posicaoAtual]);

    const lancesDaPecaSelecionada = useMemo((): Lance[] => {
        return obterLancesDasJogadas(jogadasDaPecaSelecionada);
    }, [jogadasDaPecaSelecionada]);

    const voltarLance = useCallback(() => {
        if (historico.length <= 1 || statusJogo !== 'jogando') return;

        const novoHistorico = [...historico];
        novoHistorico.pop();
        setHistorico(novoHistorico);
        setTabuleiro(novoHistorico[novoHistorico.length - 1]);
        setIndiceJogada(prev => Math.max(0, prev - 1));
        setStatusJogo('jogando');
        setPecaSelecionada(null);
        // Reset do rei derrotado ao voltar lance
        setReiDerrotado(null);
    }, [historico, statusJogo]);

    const processarClique = useCallback((casa: Casa) => {
        if (statusJogo !== 'jogando') return;

        const pecaNaCasa = encontrarPecaCallback(casa);

        // Se ainda não há peça selecionada
        if (!pecaSelecionada) {
            if (pecaNaCasa) {
                setPecaSelecionada(casa);
            }
            return;
        }

        // Se já há peça selecionada e o clique é num destino possível
        if (ehCasaDestinoPossivel(casa, lancesDaPecaSelecionada)) {
            moverPecaPara(casa);
            return;
        }

        //Troca a seleção ou movimenta a peça
        if (pecaNaCasa) {
            setPecaSelecionada(casa);
        } else {
            moverPecaPara(casa);
        }

        // Se clicou em qualquer outra coisa, cancela a seleção
        setPecaSelecionada(null);
    }, [
        statusJogo,
        encontrarPecaCallback,
        pecaSelecionada,
        moverPecaPara,
        lancesDaPecaSelecionada
    ]);

    const renderizarCasa = useCallback((casa: Casa, i: number, j: number) => {
        const pecaNaCasa = encontrarPecaCallback(casa);
        const destinoPossivel = ehCasaDestinoPossivel(casa, lancesDaPecaSelecionada);
        const isSelecionada =
            pecaSelecionada?.linha === casa.linha &&
            pecaSelecionada?.coluna === casa.coluna;

        return (
            <View
                key={`${i}-${j}`}
                style={[
                    (linhas > 6 || colunas > 6) ? estilosDinamicos.casa : styles.casa,
                    { backgroundColor: (i + j) % 2 === 0 ? '#FFF1F8' : '#CDB4DB' },
                    isSelecionada && styles.casaSelecionada,
                    destinoPossivel && styles.casaDestino,
                ]}
            >
                {pecaNaCasa ? (
                    <TouchableOpacity
                        disabled={statusJogo !== 'jogando'}
                        onPress={() => processarClique(casa)}
                        style={{ position: 'relative' }}
                    >
                        {destinoPossivel && (
                            <TouchableOpacity
                                disabled={statusJogo !== 'jogando'}
                                onPress={() => processarClique(casa)}
                                style={styles.bolinhaDestinoGrandes}
                            />
                        )}

                        <Image
                            source={obterImagemPeca(pecaNaCasa.peca)}
                            style={styles.imagemPeca}
                        />
                    </TouchableOpacity>
                ) : destinoPossivel ? (
                    <TouchableOpacity
                        disabled={statusJogo !== 'jogando'}
                        onPress={() => processarClique(casa)}
                        style={styles.bolinhaDestino}
                    />
                ) : (
                    <TouchableOpacity
                        disabled={statusJogo !== 'jogando'}
                        onPress={() => processarClique(casa)}
                        style={styles.casaVazia}
                    />
                )}
            </View>
        );
    }, [
        encontrarPecaCallback,
        pecaSelecionada,
        statusJogo,
        processarClique,
        lancesDaPecaSelecionada,
        obterImagemPeca // Adicionando a nova dependência
    ]);

    return (
        <View style={styles.container}>

            {/* Informações do jogo */}
            <View style={styles.infoJogo}>
                <Text style={styles.infoTexto}>
                    Nivel {nivel}
                </Text>
                <Text style={styles.infoTexto}>
                    Mate em {mate}
                </Text>
            </View>

            {/* Tabuleiro */}
            <View style={linhas > 6 || colunas > 6 ? estilosDinamicos.tabuleiroContainer : styles.tabuleiroContainer}>
                {tabuleiroGrid.map((linhaCasas, i) => (
                    <View key={i} style={linhas > 6 || colunas > 6 ? estilosDinamicos.linha : styles.linha}>
                        {linhaCasas.map((casa, j) => renderizarCasa(casa, i, j))}
                    </View>
                ))}
            </View>

            {/* Controles do jogo */}
            <View style={styles.controles}>
                <TouchableOpacity
                    style={[styles.botaoVoltar, !podeVoltarLance && styles.botaoDesabilitado]}
                    onPress={voltarLance}
                    disabled={!podeVoltarLance}
                >
                    <AntDesign name="arrowleft" size={24} color="#2D2A31" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botaoReiniciar}
                    onPress={iniciarOuResetarJogo}
                >
                    <Text style={styles.textoBotao}><SimpleLineIcons name="reload" size={30} color="#2D2A31" /></Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}