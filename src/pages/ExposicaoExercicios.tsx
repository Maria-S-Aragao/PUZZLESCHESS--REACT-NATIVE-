// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Exercicios } from "../data/Exercicios";
// import { View, Text, TouchableOpacity } from "react-native";
// import { useEffect, useState } from "react";
// import { getExercicioById } from "../service/ExercicioService";
// import { GeradorTabuleiroGrid } from "../functions/GeradorTabuleiro";
// import { Casa } from "../types/Casa";
// import { encontrarPeca, posicaoToEstadoTabuleiro } from "../util/TabuleiroUtils";
// import { styles } from "../constants/Pecas.styles";

// export function ExposicaoExercicio() {
//     const [nivelAtual, setNivelAtual] = useState(1);

//     useEffect(() => {
//         async function carregarNivel() {
//             const valor = await AsyncStorage.getItem("nivelAtual");
//             setNivelAtual(Number(valor) || 1);
//         }
//         carregarNivel();
//     }, []);

//     const renderizarCasa = (casa: Casa, i: number, j: number, id: number) => {
//          const exercicio = getExercicioById(id);

//         if (!exercicio) return null;

//         const estadotabuleiro = posicaoToEstadoTabuleiro(exercicio.exercicio.posicaoInicial);
//         const pecaNaCasa = encontrarPeca(estadotabuleiro, casa);

//         const corCasa = (i + j) % 2 === 0 ?
//             styles={backgroundcolor: "white"} :
//             styles={backgroundcolor: "black"};
//     }

//     const geraraImagemTabuleiro = (id: number) => {
//         const exercicio = getExercicioById(id);

//         if (!exercicio) return null;

//         const tabuleiro = GeradorTabuleiroGrid(Number(exercicio.linhas), Number(exercicio.colunas));

//         return (
//             <View>
//                 {tabuleiro.map((linhaCasas, i) => (
//                     <View key={i}>
//                         {linhaCasas.map((casa, j) => renderizarCasa(casa, i, j))}
//                     </View>
//                 ))}
//             </View>
//         )
//     };

//     return (
//         <View>
//             {Exercicios.map((exercicio) => {
//                 const liberado = exercicio.id <= nivelAtual;
//                 return liberado ? (

//                     <TouchableOpacity key={exercicio.id} onPress={() => console.log("Abrir exercício", exercicio.id)} >
//                         <Text> Nível {exercicio.nivel}</Text>
//                         <View>


//                         </View>
//                     </TouchableOpacity>

//                 ) : null;
//             })}
//         </View>
//     );
// }
