import { useCallback, useEffect, useMemo, useState } from "react";
import { Casa } from "../types/Casa";
import { Exercicio } from "../types/Exercicio";
import { EstadoTabuleiro } from "../types/EstadoTabuleiro"
import { casaToString, encontrarPeca, posicaoToEstadoTabuleiro } from "../util/TabuleiroUtils";
import { StatusJogo } from "../types/StatusJogo";
import { GeradorTabuleiroGrid } from "../functions/GeradorTabuleiro";
import { Lance } from "../types/Lance";
import { Alert, TouchableOpacity, View, Image, Text } from "react-native";
import { ehCasaDestinoPossivel, obterLancesDasJogadas } from "../functions/Jogadas";
import { Jogada } from "../types/Jogada";
import { styles } from "./Jogo.styles";

interface JogoProps {
  exercicio: Exercicio;
  linhas: number;
  colunas: number;
}

export function Jogo({ exercicio, linhas, colunas }: JogoProps) {

    const [tabuleiro, setTabuleiro] = useState<EstadoTabuleiro>(new Map());
    const [pecaSelecionada, setPecaSelecionada] = useState<Casa | null>(null);
    const [statusJogo, setStatusJogo] = useState<StatusJogo>('jogando');
    const [indiceJogada, setIndiceJogada] = useState(0);
    const [historico, setHistorico] = useState<EstadoTabuleiro[]>([]);

    const tabuleiroGrid = useMemo(() => GeradorTabuleiroGrid(linhas, colunas), [linhas, colunas]);

    const encontrarPecaCallback = useCallback((casa: Casa) => encontrarPeca(tabuleiro, casa), [tabuleiro]);

    const posicaoAtual = useMemo(() => exercicio.posicoes[indiceJogada], [exercicio.posicoes, indiceJogada]);
    /*Explicação: Assim como o useCallback, o useMemo guarda em cache o resultado, então neste momento, 
    está const está retornando a posição atual do exercício se baseando no indiceJogada, de forma melhor
    explicada, o indice vai retornar um número, e o useMemo vai acessar o array de posições pelo indice 
    passado: "() => exercicio.posicoes[indiceJogada]". 
      Agora o segundo parametro passado tem completa relação com o useMemo, que dita que só deve ser 
    rebuscado a posição quando o exercicio.posicoes mudarem ou quando o indiceJogada mudar.*/

    const copiarTabuleiro = useCallback((origem: EstadoTabuleiro): EstadoTabuleiro => { return new Map(origem); }, []);

    const podeVoltarLance = historico.length > 1 && statusJogo === 'jogando';

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
        } else if (finalizacao === 'perdeu') {
            setStatusJogo('perdeu');
        } else {
            setStatusJogo('jogando');
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
            Alert.alert('Movimento inválido', 'Essa jogada não é permitida.');
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
                    styles.casa,
                    { backgroundColor: (i + j) % 2 === 0 ? '#f0d9b5' : '#b58863' },
                    isSelecionada && styles.casaSelecionada,
                    destinoPossivel && styles.casaDestino,
                ]}
            >
                {pecaNaCasa ? (
                    <TouchableOpacity
                        disabled={statusJogo !== 'jogando'}
                        onPress={() => processarClique(casa)}
                    >
                        <Image
                            source={pecaNaCasa.peca.imagem}
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

                <Text style={styles.coordenadas}>
                    {casa.linha},{casa.coluna}
                </Text>
            </View>
        );
    }, [
        encontrarPeca,
        pecaSelecionada,
        statusJogo,
        processarClique,
    ]);

    return (
        <View style={styles.container}>


            <View style={styles.controles}>
                <TouchableOpacity
                    style={[styles.botaoVoltar, !podeVoltarLance && styles.botaoDesabilitado]}
                    onPress={voltarLance}
                    disabled={!podeVoltarLance}
                >
                    <Text style={styles.textoBotao}>↩️ Voltar Lance</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botaoReiniciar}
                    onPress={iniciarOuResetarJogo}
                >
                    <Text style={styles.textoBotao}>🔄 Reiniciar</Text>
                </TouchableOpacity>
            </View>

            {/* {renderizarResultado()} */}

            {/* Informações do jogo */}
            <View style={styles.infoJogo}>
                <Text style={styles.infoTexto}>
                    Jogada: {indiceJogada + 1} | Status: {statusJogo}
                </Text>
            </View>

            {/* Tabuleiro */}
            <View style={styles.tabuleiroContainer}>
                {tabuleiroGrid.map((linhaCasas, i) => (
                    <View key={i} style={styles.linha}>
                        {linhaCasas.map((casa, j) => renderizarCasa(casa, i, j))}
                    </View>
                ))}
            </View>
        </View>
    );
}