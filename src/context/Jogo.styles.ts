import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    casa: {
        width: 90,
        height: 90,
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

    bolinhaDestino: {
        width: 30,
        height: 30,
        borderRadius: 16,
        backgroundColor: "rgba(0, 0, 0, 0.22)",
    },

    bolinhaDestinoGrandes: {
        position: "absolute",
        width: 60,
        height: 60,
        borderRadius: 32,
        backgroundColor: "rgba(0, 0, 0, 0.22)",
    },

    casaVazia: {
        width: "100%",
        height: "100%",
    },

    container: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center"
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
    },

});
