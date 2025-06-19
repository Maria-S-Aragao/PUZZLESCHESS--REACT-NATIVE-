import { View } from "react-native";

export function PuzzleOne() {
  return (
    <>
      {/* Tabuleiro */}
      <View>
        {Array.from({ length: 4 }).map((_, linha) => (
          <View key={linha}>
            {Array.from({ length: 2 }).map((_, coluna) => {
              const key = `${linha}-${coluna}`;
              return (
                /*Casa do tabuleiro*/
                <View key={key}>
                  {/*Primeiro temos que colocar as peças nas casas iniciais*/}
                  
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </>
  );
}
