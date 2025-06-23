import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getExercicioById } from "../src/service/ExercicioService";
import { GeradorTabuleiroGrid } from "../src/functions/GeradorTabuleiro";
import { Casa } from "../src/types/Casa";
import { encontrarPeca, posicaoToEstadoTabuleiro } from "../src/util/TabuleiroUtils";
import { Exercicios } from "../src/data/Exercicios";

export default function ExposicaoExercicio() {
    const [nivelAtual, setNivelAtual] = useState(1);

    useEffect(() => {
        async function carregarNivel() {
            const valor = await AsyncStorage.getItem("nivelAtual");
            setNivelAtual(Number(valor) || 1);
        }
        carregarNivel();
    }, []);

    const renderizarCasa = (casa: Casa, i: number, j: number, id: number) => {
        const exercicio = getExercicioById(id);

        if (!exercicio) return null;

        const estadoTabuleiro = posicaoToEstadoTabuleiro(exercicio.exercicio.posicaoInicial);
        const pecaNaCasa = encontrarPeca(estadoTabuleiro, casa);

        // Determina a cor de fundo da casa (tabuleiro xadrez)
        const corFundoCasa = (i + j) % 2 === 0 ? '#f0f0f0' : '#d0d0d0';

        // Determina a cor da peça (quadrado)
        let corPeca = null;
        if (pecaNaCasa) {
            corPeca = pecaNaCasa.peca.cor === 'branco' ? '#ffffff' : '#000000';
        }

        return (
            <View
                key={`${i}-${j}`}
                style={[
                    estilosMini.casa,
                    { backgroundColor: corFundoCasa }
                ]}
            >
                {pecaNaCasa && (
                    <View
                        style={[
                            estilosMini.peca,
                            {
                                backgroundColor: pecaNaCasa.peca.cor === 'branco' ? '#ffffff' : '#000000',
                                borderColor: pecaNaCasa.peca.cor === 'branco' ? '#333' : '#fff',
                                borderWidth: 0.5
                            }
                        ]}
                    />
                )}
            </View>
        );
    };

    const gerarImagemTabuleiro = (id: number) => {
        const exercicio = getExercicioById(id);

        if (!exercicio) return null;

        const tabuleiro = GeradorTabuleiroGrid(
            Number(exercicio.linhas),
            Number(exercicio.colunas)
        );

        return (
            <View style={estilosMini.tabuleiroContainer}>
                {tabuleiro.map((linhaCasas, i) => (
                    <View key={i} style={estilosMini.linha}>
                        {linhaCasas.map((casa, j) => renderizarCasa(casa, i, j, id))}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={estilos.container}>
            {Exercicios.map((exercicio) => {
                const liberado = exercicio.id <= nivelAtual;
                return liberado ? (
                    <TouchableOpacity
                        key={exercicio.id}
                        style={estilos.exercicioItem}
                        onPress={() => console.log("Abrir exercício", exercicio.id)}
                    >
                        <View style={estilos.exercicioContent}>
                            <Text style={estilos.nivelTexto}>Nível {exercicio.nivel}</Text>
                            <View style={estilos.tabuleiroWrapper}>
                                {gerarImagemTabuleiro(exercicio.id)}
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : null;
            })}
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    exercicioItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    exercicioContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    nivelTexto: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    tabuleiroWrapper: {
        flex: 1,
        alignItems: 'center',
    },
});

const estilosMini = StyleSheet.create({
    tabuleiroContainer: {
        borderWidth: 1,
        borderColor: '#333',
        backgroundColor: '#fff',
    },
    linha: {
        flexDirection: 'row',
    },
    casa: {
        width: 12,
        height: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    peca: {
        width: 8,
        height: 8,
        borderRadius: 1,
    },
});