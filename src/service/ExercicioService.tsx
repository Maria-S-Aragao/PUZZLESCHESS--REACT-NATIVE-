import { Exercicios } from '../data/Exercicios';

export function getExercicioById(id: number) {
  return Exercicios.find(exercicio => exercicio.id === id);
}
