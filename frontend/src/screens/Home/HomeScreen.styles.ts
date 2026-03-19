import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Um cinza bem claro para destacar os cards brancos
  },

  botaoFlutuante: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#28a8b5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  textoBotao: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  // Estilização do conteúdo da lista (essencial para o respiro do layout)
  listaConteudo: {
    paddingHorizontal: 16, // Margem nas laterais para os cards não encostarem na borda
    paddingBottom: 100, 
    flexGrow: 1,    // Espaço extra no fim para o último card não ficar colado na barra de navegação
  },

  // O divisor entre um card e outro
  divisor: {
    height: 16, // Distância vertical entre os cards
  },

  // Estilização do cabeçalho (Header)
  containerCabecalho: {
    marginBottom: 20,   // Espaço entre o título e o primeiro card
    paddingHorizontal: 4, // Alinhamento leve com os cards
  },

  containerVazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoVazio: {
    fontSize: 16,
    color: '#888',
  },

  titulo: {
    fontFamily: 'Inter-Bold', // Use a fonte que você já configurou
    fontSize: 24,
    color: '#1A1A1A',        // Um preto quase puro para boa legibilidade
    letterSpacing: -0.5,     // Estilo moderno de tipografia
  },
});