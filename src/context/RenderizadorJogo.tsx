import { useCallback, useEffect, useMemo, useState } from "react";
import { Casa } from "../types/Casa";
import { Exercicio } from "../types/Exercicio";
import { EstadoTabuleiro } from "../types/EstadoTabuleiro"
import { casaToString, encontrarPeca, posicaoToEstadoTabuleiro } from "../util/TabuleiroUtils";
import { StatusJogo } from "../types/StatusJogo";
import { GeradorTabuleiroGrid } from "../functions/GeradorTabuleiro";
import { Lance } from "../types/Lance";
import { TouchableOpacity, View, Image, Text, Dimensions, KeyboardAvoidingView } from "react-native";
import { ehCasaDestinoPossivel, obterLancesDasJogadas } from "../functions/Jogadas";
import { Jogada } from "../types/Jogada";
import { styles } from "./Jogo.styles";
import { Peca } from "../types/Peca";
import * as Pecas from "../constants/Pecas"
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { TextInput } from "react-native";
import { getExercicioById } from "../service/ExercicioService";

export interface JogoProps {
    exercicio: Exercicio;
    linhas: number;
    colunas: number;
    nivel: number,
    mate: number,
    corJogador: "branco" | "preto",
    corAdversario: "branco" | "preto",
    onProximoNivel?: () => void;
    // Adicionar função para verificar se existe próximo exercício
    verificarProximoExercicio?: (nivel: number) => Promise<boolean>;
}

//Temas personalizados
const temasDeCore = [
    {
        nome: 'Rosa',
        fundo: 'pink',
        botoes: '#CDB4DB',
        casaClara: '#FFF1F8',
        casaEscura: '#CDB4DB'
    },
    {
        nome: 'Azul',
        fundo: '#E3F2FD',
        botoes: '#64B5F6',
        casaClara: '#F3E5F5',
        casaEscura: '#64B5F6'
    },
    {
        nome: 'Verde',
        fundo: '#E8F5E8',
        botoes: '#81C784',
        casaClara: '#F1F8E9',
        casaEscura: '#81C784'
    },
    {
        nome: 'Roxo',
        fundo: '#F3E5F5',
        botoes: '#BA68C8',
        casaClara: '#FCE4EC',
        casaEscura: '#BA68C8'
    },
    {
        nome: 'Laranja',
        fundo: '#FFF3E0',
        botoes: '#FFB74D',
        casaClara: '#FFF8E1',
        casaEscura: '#FFB74D'
    },
    {
        nome: 'Ciano',
        fundo: '#E0F2F1',
        botoes: '#4DB6AC',
        casaClara: '#E8F5E8',
        casaEscura: '#4DB6AC'
    }
];

// Função para escolher tema aleatório
const escolherTemaAleatorio = () => {
    const indiceAleatorio = Math.floor(Math.random() * temasDeCore.length);
    return temasDeCore[indiceAleatorio];
};

export function Jogo({
    exercicio,
    linhas,
    colunas,
    nivel,
    mate,
    corAdversario,
    corJogador,
    verificarProximoExercicio
}: JogoProps) {
    const router = useRouter();

    //Aqui é uma atualização do tamanho das casas e tabuleiro, caso ele tenha que ser maior e adicionando as cores tema
    const { width, height } = Dimensions.get('window');
    const tamanhoTabuleiro = Math.min(width * 0.95, height * 0.5);
    const tamanhoCasa = tamanhoTabuleiro / Math.max(linhas, colunas);
    const [temaAtual] = useState(() => escolherTemaAleatorio());

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

        containerTematico: {
            flex: 1,
            width: 700,
            height: 700,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: temaAtual.fundo,
        },
        botaoTematico: {
            backgroundColor: temaAtual.botoes,
        },
        casaClaraTematica: {
            backgroundColor: temaAtual.casaClara,
        },
        casaEscuraTematica: {
            backgroundColor: temaAtual.casaEscura,
        }
    });

    const [tabuleiro, setTabuleiro] = useState<EstadoTabuleiro>(new Map());
    const [pecaSelecionada, setPecaSelecionada] = useState<Casa | null>(null);
    const [statusJogo, setStatusJogo] = useState<StatusJogo>('jogando');
    const [indiceJogada, setIndiceJogada] = useState(0);
    const [historico, setHistorico] = useState<EstadoTabuleiro[]>([]);
    const [reiDerrotado, setReiDerrotado] = useState<{ cor: 'branco' | 'preto' } | null>(null);
    const [temProximoExercicio, setTemProximoExercicio] = useState<boolean | null>(null); // Mudança aqui: null para indicar "não verificado ainda"
    const [verificandoProximo, setVerificandoProximo] = useState<boolean>(false);
    const [comentando, setComentando] = useState(false);
    const [comentarioTexto, setComentarioTexto] = useState("");

    const tabuleiroGrid = useMemo(() => GeradorTabuleiroGrid(linhas, colunas), [linhas, colunas]);

    const encontrarPecaCallback = useCallback((casa: Casa) => encontrarPeca(tabuleiro, casa), [tabuleiro]);

    const posicaoAtual = useMemo(() => exercicio.posicoes[indiceJogada], [exercicio.posicoes, indiceJogada]);

    const copiarTabuleiro = useCallback((origem: EstadoTabuleiro): EstadoTabuleiro => { return new Map(origem); }, []);

    const podeVoltarLance = historico.length > 1 && statusJogo === 'jogando';

    // Função para verificar se existe próximo exercício - CORRIGIDA
    const verificarSeTemProximoExercicio = useCallback(() => {
        const temExercicio = getExercicioById(nivel + 1);
        const resultado = !!temExercicio;

        setTemProximoExercicio(resultado);

        return resultado;
    }, [nivel]);

    // Função para navegar para o próximo exercício
    const irParaProximoExercicio = useCallback(() => {
        if (temProximoExercicio) {
            router.push(`/exercicio/${nivel + 1}`);
        }
    }, [temProximoExercicio, nivel, router]);

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

    // Verificar próximo exercício quando o jogo é ganho - CORRIGIDO
    useEffect(() => {
        if (statusJogo === 'ganhou') {
            // Adiciona um pequeno delay para garantir que o estado foi atualizado
            const timer = setTimeout(() => {
                verificarSeTemProximoExercicio();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [statusJogo, verificarSeTemProximoExercicio]);

    const iniciarOuResetarJogo = useCallback(() => {
        const estadoInicial = posicaoToEstadoTabuleiro(exercicio.posicaoInicial);
        setTabuleiro(estadoInicial);
        setHistorico([estadoInicial]);
        setIndiceJogada(0);
        setStatusJogo('jogando');
        setPecaSelecionada(null);
        setReiDerrotado(null);
        setTemProximoExercicio(null); // Reset para null ao reiniciar
        setVerificandoProximo(false);
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

    const atualizarStatusJogo = useCallback(async (finalizacao?: Lance['finalizacao']): Promise<void> => {
        if (finalizacao === 'ganhou') {
            setStatusJogo('ganhou');
            setReiDerrotado({ cor: corAdversario });
            const nivelAtualString = await AsyncStorage.getItem('nivelAtual');
            const nivelAtual = nivelAtualString ? parseInt(nivelAtualString) : 0;
            if (nivel > nivelAtual) {
                AsyncStorage.setItem('nivelAtual', nivel.toString());
            }
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

        // Determina a cor da casa baseada na posição e tema atual
        const corCasa = (i + j) % 2 === 0 ?
            estilosDinamicos.casaClaraTematica :
            estilosDinamicos.casaEscuraTematica;

        return (
            <View
                key={`${i}-${j}`}
                style={[
                    (linhas > 6 || colunas > 6) ? estilosDinamicos.casa : styles.casa,
                    corCasa,
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
        obterImagemPeca,
        estilosDinamicos
    ]);

    const toggleComentando = () => {
        setComentando(prev => !prev);
    };

    const enviarComentario = () => {
        console.log("Comentário enviado:", comentarioTexto);
        setComentarioTexto("");
        setComentando(false);
    };

    const renderizarBotaoComentar = () => (
        <View style={styles.containerComentar}>
            {!comentando ? (
                <TouchableOpacity
                    style={[styles.botaoComentar, estilosDinamicos.botaoTematico]}
                    onPress={toggleComentando}
                >
                    <Text style={styles.textoBotaoComentar}>Comentar</Text>
                </TouchableOpacity>
            ) : (
                <View>
                    <TextInput
                        style={styles.inputComentario}
                        placeholder="Diga como foi sua experiência de jogo..."
                        multiline
                        maxLength={100}
                        value={comentarioTexto}
                        onChangeText={setComentarioTexto}
                        autoFocus
                    />
                    <View style={styles.botoesComentarioContainer}>
                        <TouchableOpacity
                            style={[styles.botaoComentar, styles.botaoEnviar, estilosDinamicos.botaoTematico]}
                            onPress={enviarComentario}
                            disabled={comentarioTexto.trim() === ""}
                        >
                            <Text style={styles.textoBotaoComentar}>Enviar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.botaoComentar, styles.botaoCancelar, estilosDinamicos.botaoTematico]}
                            onPress={() => {
                                setComentarioTexto("");
                                setComentando(false);
                            }}
                        >
                            <Text style={styles.textoBotaoComentar}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );

    const renderizarBotaoProximo = () => {
        if (temProximoExercicio === true) {
            return (
                <TouchableOpacity
                    style={[styles.botaoProximo, estilosDinamicos.botaoTematico]}
                    onPress={irParaProximoExercicio}
                >
                    <Text style={styles.textoBotaoProximo}>Próximo</Text>
                </TouchableOpacity>
            );
        }

        if (temProximoExercicio === false) {
            return (
                <View style={styles.containerFinal}>
                    <View style={[styles.botaoProximo, styles.botaoDesabilitado]}>
                        <Text style={styles.textoBotaoDesabilitado}>
                            No momento não há mais exercícios disponíveis...
                        </Text>
                    </View>
                    <View style={styles.containerExtras}>
                        <View>{renderizarBotaoComentar()}</View>
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.containerFinal}>
                <View style={[styles.botaoProximo, styles.botaoDesabilitado]}>
                    <Text style={styles.textoBotaoDesabilitado}>
                        Carregando...
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={estilosDinamicos.containerTematico}>
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
            {statusJogo === 'jogando' || statusJogo === 'perdeu' ? (
                <View style={styles.controles}>
                    <TouchableOpacity
                        style={[
                            styles.botaoVoltar,
                            estilosDinamicos.botaoTematico,
                            !podeVoltarLance && styles.botaoDesabilitado
                        ]}
                        onPress={voltarLance}
                        disabled={!podeVoltarLance}
                    >
                        <AntDesign name="arrowleft" size={24} color="#f5f5f5" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.botaoReiniciar, estilosDinamicos.botaoTematico]}
                        onPress={iniciarOuResetarJogo}
                    >
                        <Text style={styles.textoBotao}>
                            <SimpleLineIcons name="reload" size={30} color="#f5f5f5" />
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                renderizarBotaoProximo()
            )}
        </View>
    );
}