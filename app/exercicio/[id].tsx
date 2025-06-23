import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getExercicioById } from '../../src/service/ExercicioService';
import { Jogo } from '../../src/context/RenderizadorJogo';

export default function Exercicio() {
  const {id} = useLocalSearchParams();
  const exercicio = getExercicioById(Number(id));

  if (!exercicio) return null;

  return (
    <Jogo
      exercicio={exercicio.exercicio}
      linhas={exercicio.linhas}
      colunas={exercicio.colunas}
      nivel={exercicio.nivel}
      mate={exercicio.mate}
      corJogador={exercicio.corJogador}
      corAdversario={exercicio.corAdversario}
    />
  );
}