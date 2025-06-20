import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Exercicio, Casa, Lance, PosicaoInicial, Jogada} from './Organizacao'; 
import { Tabuleiro } from './Tabuleiro'; 
import { Peca, Pecas } from './Pecas'; 

const TAM_CASA = 40;

type Props = {
  exercicio: Exercicio;
  linhas: number;
  colunas: number;
};

// Tipo para representar o estado do tabuleiro
type EstadoTabuleiro = Map<string, PosicaoInicial>;

// Estado do jogo
type StatusJogo = 'jogando' | 'ganhou' | 'perdeu';

export function JogoSimples({ exercicio, linhas, colunas }: Props) {
  const [tabuleiro, setTabuleiro] = useState<EstadoTabuleiro>(new Map());
  const [pecaSelecionada, setPecaSelecionada] = useState<Casa | null>(null);
  const [statusJogo, setStatusJogo] = useState<StatusJogo>('jogando');
  const [indiceJogada, setIndiceJogada] = useState(0);
  const [historico, setHistorico] = useState<EstadoTabuleiro[]>([]);
  
  const tabuleiroGrid = useMemo(() => Tabuleiro(linhas, colunas), [linhas, colunas]);
  const pecasObj = useMemo(() => Pecas(), []);

  // Função para criar chave única da casa
  const criarChaveCasa = useCallback((casa: Casa): string => 
    `${casa.linha}-${casa.coluna}`, []);

  // Converte array de posições para estado do tabuleiro
  const converterParaEstadoTabuleiro = useCallback((posicoes: PosicaoInicial[]): EstadoTabuleiro => {
    const estado = new Map<string, PosicaoInicial>();
    posicoes.forEach(pos => {
      const chave = criarChaveCasa(pos.casa);
      estado.set(chave, pos);
    });
    return estado;
  }, [criarChaveCasa]);

  // Inicializa o jogo
  const inicializarJogo = useCallback(() => {
    const estadoInicial = converterParaEstadoTabuleiro(exercicio.posicaoInicial);
    setTabuleiro(estadoInicial);
    setHistorico([estadoInicial]);
    setIndiceJogada(0);
    setStatusJogo('jogando');
    setPecaSelecionada(null);
  }, [exercicio.posicaoInicial, converterParaEstadoTabuleiro]);

  // Carrega o exercício quando mudar
  useEffect(() => {
    inicializarJogo();
  }, [inicializarJogo]);

  // Encontra peça em casa
  const encontrarPeca = useCallback((casa: Casa): PosicaoInicial | undefined => {
    const chave = criarChaveCasa(casa);
    return tabuleiro.get(chave);
  }, [tabuleiro, criarChaveCasa]);

  // Obtém a posição atual do exercício
  const posicaoAtual = useMemo(() => 
    exercicio.posicoes[indiceJogada], [exercicio.posicoes, indiceJogada]);

  // Retorna jogadas possíveis para peça selecionada
  const jogadasDaPecaSelecionada = useMemo((): Jogada[] => {
    if (!pecaSelecionada || !posicaoAtual) return [];
    
    return posicaoAtual.jogadas.filter(jogada => 
      jogada.lances.some(lance =>
        lance.casa_inicial.linha === pecaSelecionada.linha &&
        lance.casa_inicial.coluna === pecaSelecionada.coluna
      )
    );
  }, [pecaSelecionada, posicaoAtual]);

  // Retorna lances possíveis para peça selecionada
  const lancesDaPecaSelecionada = useMemo((): Lance[] => {
    return jogadasDaPecaSelecionada.flatMap(jogada => jogada.lances);
  }, [jogadasDaPecaSelecionada]);

  // Verifica se a casa é destino possível para jogada
  const ehDestinoPossivel = useCallback((casa: Casa): boolean => {
    return lancesDaPecaSelecionada.some(
      lance => lance.casa_final.linha === casa.linha && lance.casa_final.coluna === casa.coluna
    );
  }, [lancesDaPecaSelecionada]);

  // Verifica se uma peça pode ser selecionada (apenas peças brancas do jogador)
  const podeSerSelecionada = useCallback((peca: Peca): boolean => {
    return peca.cor === 'branco' && statusJogo === 'jogando';
  }, [statusJogo]);

  // Verifica se uma casa pode ser clicada (para seleção ou movimento)
  const podeClicarNaCasa = useCallback((casa: Casa): boolean => {
    if (statusJogo !== 'jogando') return false;
    
    const pecaNaCasa = encontrarPeca(casa);
    
    // Se não há peça selecionada, só pode clicar em peças brancas
    if (!pecaSelecionada) {
      return pecaNaCasa ? podeSerSelecionada(pecaNaCasa.peca) : false;
    }
    
    // Se há peça selecionada, pode clicar em destinos válidos (incluindo capturas)
    return ehDestinoPossivel(casa);
  }, [statusJogo, encontrarPeca, pecaSelecionada, podeSerSelecionada, ehDestinoPossivel]);

  // Cria uma cópia do tabuleiro
  const copiarTabuleiro = useCallback((origem: EstadoTabuleiro): EstadoTabuleiro => {
    return new Map(origem);
  }, []);

  // Executa capturas de um lance
  const executarCapturas = useCallback((
    novoTabuleiro: EstadoTabuleiro, 
    capturas: Casa[]
  ): void => {
    capturas.forEach(casaCaptura => {
      const chaveCaptura = criarChaveCasa(casaCaptura);
      novoTabuleiro.delete(chaveCaptura);
    });
  }, [criarChaveCasa]);

  // Executa resposta automática
  const executarResposta = useCallback((
    novoTabuleiro: EstadoTabuleiro,
    resposta: Lance['resposta']
  ): void => {
    if (!resposta) return;

    const chaveInicial = criarChaveCasa(resposta.casa_inicial);
    const chaveFinal = criarChaveCasa(resposta.casa_final);

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
  }, [criarChaveCasa]);

  // Atualiza status do jogo baseado na finalização
  const atualizarStatusJogo = useCallback((finalizacao?: Lance['finalizacao']): void => {
    if (finalizacao === 'ganhou') {
      setStatusJogo('ganhou');
    } else if (finalizacao === 'perdeu') {
      setStatusJogo('perdeu');
    } else {
      setStatusJogo('jogando');
    }
  }, []);

  // Executa um movimento (lance) selecionado
  const moverPecaPara = useCallback((casaDestino: Casa) => {
    if (!pecaSelecionada || statusJogo !== 'jogando') return;

    const lance = lancesDaPecaSelecionada.find(
      l => l.casa_final.linha === casaDestino.linha && l.casa_final.coluna === casaDestino.coluna
    );

    if (!lance) {
      Alert.alert('Movimento inválido', 'Essa jogada não é permitida.');
      return;
    }

    const pecaAtual = encontrarPeca(pecaSelecionada);
    if (!pecaAtual) return;

    // Cria novo estado do tabuleiro
    const novoTabuleiro = copiarTabuleiro(tabuleiro);

    // Remove a peça da casa inicial
    const chaveInicial = criarChaveCasa(pecaSelecionada);
    novoTabuleiro.delete(chaveInicial);

    // Remove peça capturada na casa final (se houver)
    const chaveFinal = criarChaveCasa(casaDestino);
    if (novoTabuleiro.has(chaveFinal)) {
      novoTabuleiro.delete(chaveFinal);
    }

    // Executa capturas específicas (se houver)
    if (lance.capturas && Array.isArray(lance.capturas)) {
      executarCapturas(novoTabuleiro, lance.capturas);
    }

    // Adiciona a peça na casa final
    // Nota: Assumindo que a peça final é determinada pela jogada ou mantém a original
    novoTabuleiro.set(chaveFinal, { 
      casa: casaDestino, 
      peca: pecaAtual.peca
    });

    // Executa a resposta automática, se houver
    executarResposta(novoTabuleiro, lance.resposta);

    // Atualiza o estado
    setTabuleiro(novoTabuleiro);
    setHistorico(prev => [...prev, novoTabuleiro]);
    setPecaSelecionada(null);
    setIndiceJogada(prev => prev + 1);

    // Atualiza status do jogo
    atualizarStatusJogo(lance.finalizacao);
  }, [
    pecaSelecionada, 
    statusJogo, 
    lancesDaPecaSelecionada, 
    encontrarPeca, 
    copiarTabuleiro, 
    tabuleiro, 
    criarChaveCasa, 
    executarCapturas, 
    executarResposta, 
    atualizarStatusJogo
  ]);

  // Voltar lance
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

  // Seleciona peça ou executa movimento
  const processarClique = useCallback((casa: Casa) => {
    if (statusJogo !== 'jogando') return;
    
    const pecaNaCasa = encontrarPeca(casa);
    
    // Se não há peça selecionada
    if (!pecaSelecionada) {
      if (pecaNaCasa && podeSerSelecionada(pecaNaCasa.peca)) {
        setPecaSelecionada(casa);
      } else if (pecaNaCasa) {
        Alert.alert('Seleção inválida', 'Você só pode mover peças brancas.');
      }
      return;
    }
    
    // Se há peça selecionada
    if (ehDestinoPossivel(casa)) {
      // Movimento válido (pode ser captura ou movimento simples)
      moverPecaPara(casa);
    } else if (pecaNaCasa && podeSerSelecionada(pecaNaCasa.peca)) {
      // Selecionou outra peça branca
      setPecaSelecionada(casa);
    } else {
      // Clique inválido
      setPecaSelecionada(null);
    }
  }, [statusJogo, encontrarPeca, pecaSelecionada, podeSerSelecionada, ehDestinoPossivel, moverPecaPara]);

  // Pega imagem da peça para renderizar
  const getImagemPeca = useCallback((peca: Peca) => {
    for (const key in pecasObj) {
      const pecaObj = pecasObj[key as keyof typeof pecasObj];
      if (pecaObj.nome === peca.nome && pecaObj.cor === peca.cor) {
        return pecaObj.imagem;
      }
    }
    return null;
  }, [pecasObj]);

  // Renderiza casa do tabuleiro
  const renderizarCasa = useCallback((casa: Casa, i: number, j: number) => {
    const pecaNaCasa = encontrarPeca(casa);
    const destinoPossivel = ehDestinoPossivel(casa);
    const isSelecionada = pecaSelecionada?.linha === casa.linha && 
                         pecaSelecionada?.coluna === casa.coluna;
    
    return (
      <View
        key={`${i}-${j}`}
        style={[
          styles.casa,
          { backgroundColor: (i + j) % 2 === 0 ? '#f0d9b5' : '#b58863' },
          isSelecionada && styles.casaSelecionada,
          destinoPossivel && styles.casaDestino
        ]}
      >
        {pecaNaCasa ? (
          <TouchableOpacity
            disabled={statusJogo !== 'jogando'}
            onPress={() => processarClique(casa)}
          >
            <Image 
              source={getImagemPeca(pecaNaCasa.peca)!} 
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
        
        {/* Coordenadas da casa para debug */}
        <Text style={styles.coordenadas}>
          {casa.linha},{casa.coluna}
        </Text>
      </View>
    );
  }, [
    encontrarPeca, 
    ehDestinoPossivel, 
    pecaSelecionada, 
    statusJogo, 
    processarClique, 
    getImagemPeca
  ]);

  // Renderiza mensagem de resultado
  const renderizarResultado = () => {
    if (statusJogo === 'ganhou') {
      return (
        <View style={styles.resultadoOverlay}>
          <Text style={styles.resultadoTexto}>🎉 Parabéns! Você venceu!</Text>
        </View>
      );
    }
    
    if (statusJogo === 'perdeu') {
      return (
        <View style={styles.resultadoOverlay}>
          <Text style={styles.resultadoTexto}>☠️ Você perdeu!</Text>
        </View>
      );
    }
    
    return null;
  };

  const podeVoltarLance = historico.length > 1 && statusJogo === 'jogando';

  return (
    <View style={styles.container}>
      {renderizarResultado()}

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
          onPress={inicializarJogo}
        >
          <Text style={styles.textoBotao}>🔄 Reiniciar</Text>
        </TouchableOpacity>
      </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  casa: {
    width: TAM_CASA,
    height: TAM_CASA,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  linha: {
    flexDirection: 'row',
  },
  casaSelecionada: {
    borderColor: '#4CAF50',
    borderWidth: 3,
  },
  casaDestino: {
    borderColor: '#2196F3',
    borderWidth: 2,
  },
  imagemPeca: {
    width: TAM_CASA - 4,
    height: TAM_CASA - 4,
  },
  bolinhaDestino: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#2196F3',
    opacity: 0.7,
  },
  resultadoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 20,
    zIndex: 1000,
  },
  resultadoTexto: {
    color: 'white',
    fontSize: 26,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  controles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    gap: 10,
  },
  botaoVoltar: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  botaoReiniciar: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  botaoDesabilitado: {
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
  textoBotao: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  infoJogo: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  infoTexto: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  tabuleiroContainer: {
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#8B4513',
  },
  casaVazia: {
    width: '100%',
    height: '100%',
  },
  coordenadas: {
    position: 'absolute',
    top: 2,
    left: 2,
    fontSize: 8,
    color: '#666',
  },
});