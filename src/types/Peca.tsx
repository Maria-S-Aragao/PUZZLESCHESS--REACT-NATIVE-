import { ImageSourcePropType, ImageStyle } from "react-native"

export type Peca = {
    nome: 'rei' | 'dama' | 'bispo' | 'cavalo' | 'peao' | 'torre',
    cor: 'branco' | 'preto',
    imagem: ImageSourcePropType,
    estilo?: ImageStyle
}