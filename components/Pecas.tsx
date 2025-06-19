import { ImageSourcePropType, ImageStyle } from 'react-native';

export type Peca = {
    nome: 'rei' | 'dama' | 'bispo' | 'cavalo' | 'peao',
    cor: 'branco' | 'preto',
    imagem: ImageSourcePropType,
    estilo?: ImageStyle
}

export function Pecas() {

    const estiloPadrao: ImageStyle = {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    };

    const reiBranco: Peca = {
        nome: 'rei',
        cor: 'branco',
        imagem: require('./assets/ReiBranco.png'),
        estilo: estiloPadrao
    };

    const damaBranca: Peca = {
        nome: 'dama',
        cor: 'branco',
        imagem: require('./assets/DamaBranca.png'),
        estilo: estiloPadrao
    };

    const bispoBranco: Peca = {
        nome: 'bispo',
        cor: 'branco',
        imagem: require('./assets/BispoBranco.png'),
        estilo: estiloPadrao
    };

    const cavaloBranco: Peca = {
        nome: 'cavalo',
        cor: 'branco',
        imagem: require('./assets/CavaloBranco.png'),
        estilo: estiloPadrao
    };

    const peaoBranco: Peca = {
        nome: 'peao',
        cor: 'branco',
        imagem: require('./assets/PeaoBranco.png'),
        estilo: estiloPadrao
    };


    const reiPreto: Peca = {
        nome: 'rei',
        cor: 'preto',
        imagem: require('./assets/ReiPreto.png'),
        estilo: estiloPadrao
    };

    const damaPreta: Peca = {
        nome: 'dama',
        cor: 'preto',
        imagem: require('./assets/DamaPreta.png'),
        estilo: estiloPadrao
    };

    const bispoPreto: Peca = {
        nome: 'bispo',
        cor: 'preto',
        imagem: require('./assets/BispoPreto.png'),
        estilo: estiloPadrao
    };

    const cavaloPreto: Peca = {
        nome: 'cavalo',
        cor: 'preto',
        imagem: require('./assets/CavaloPreto.png'),
        estilo: estiloPadrao
    };

    const peaoPreto: Peca = {
        nome: 'peao',
        cor: 'preto',
        imagem: require('./assets/PeaoPreto.png'),
        estilo: estiloPadrao
    };

    return {
        reiBranco,
        damaBranca,
        bispoBranco,
        cavaloBranco,
        peaoBranco,
        reiPreto,
        damaPreta,
        bispoPreto,
        cavaloPreto,
        peaoPreto
    }
}