import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: 700,
        height: 700,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "pink",
    },

    casa: {
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
    },

    casaSelecionada: {

    },

    casaDestino: {
        position: "relative",
    },

    imagemPeca: {
        width: 60,
        height: 60,
    },

    componentDasBolinhas: {
        position: "relative",
    },

    bolinhaDestino: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
    },

    bolinhaDestinoGrandes: {
        position: "absolute",
        width: 70,
        height: 70,
        borderRadius: 10,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        top: "50%",
        left: "60%",
        transform: [{ translateX: -65 }, { translateY: -35 }],
    },

    casaVazia: {
        width: "100%",
        height: "100%",
    },

    linha: {
        flexDirection: 'row',
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
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
        gap: 50,
        top: 50
    },

    botaoVoltar: {
        height: 80,
        width: 80,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#CDB4DB',
        borderRadius: 200,
    },

    botaoReiniciar: {
        height: 80,
        width: 80,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#CDB4DB',
        borderRadius: 200,
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

    textoBotaoNovo: {
        fontSize: 15,
        textAlign: "center",
        height: 25,
        width: 200,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#CDB4DB',
        borderRadius: 30,
    },

    infoJogo: {
        width: 350,
        bottom: 100,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },

    infoTexto: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },

    tabuleiroContainer: {
        alignSelf: 'center',
    },

    botaoProximo: {
        backgroundColor: '#CDB4DB',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        minWidth: 200,
    },

    textoBotaoProximo: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    botaoCarregando: {
        backgroundColor: '#CDB4DB',
    },

    textoBotaoDesabilitado: {
        color: '#9E9E9E',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 18,
    },

    containerFinal: {
        gap: 30,
        alignItems: "center",
        justifyContent: "center",
    },

    containerComentar: {
        marginTop: 10,
        alignItems: "center",
        width: '100%',
    },

    botaoComentar: {
        backgroundColor: '#CDB4DB', 
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 200,
    },

    botaoEnviar: {
        backgroundColor: '#CDB4DB',
        paddingHorizontal: 20,
    },

    botaoCancelar: {
        backgroundColor: '#CDB4DB', 
        paddingHorizontal: 20,
    },

    textoBotaoComentar: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    inputComentario: {
        width: 300,
        minHeight: 80,
        maxHeight: 120,
        borderColor: '#CDB4DB',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: 'white',
        textAlignVertical: 'top',
        fontSize: 14,
        color: '#333',
    },

    keyboardAvoiding: {
        width: '100%',
        alignItems: 'center',
    },

    botoesComentarioContainer: {
        flexDirection: 'row',
        marginTop: 8,
        justifyContent: 'center',
        gap: 10,
    },

    containerExtras: {
        flexDirection: "column",
    }

});



