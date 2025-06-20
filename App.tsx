import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { JogoSimples } from './components/MinhaLogica';
import { ContrucaoPuzzleOne } from "./components/posicoes/Puzzle"

export default function App() {
  return (
    <View style={styles.container}>
      <JogoSimples exercicio={ContrucaoPuzzleOne()} linhas={4} colunas={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
