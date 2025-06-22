import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Jogo } from './context/RenderizadorJogo';
import { ContrucaoPuzzleOne } from './models/PuzzleOne';

export default function App() {
  return (
    <View style={styles.container}>
      <Jogo exercicio={ContrucaoPuzzleOne()} linhas={4} colunas={2} />
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
