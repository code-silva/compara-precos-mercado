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
  width: '100%',        // Obrigatório para o header aparecer
  // Adicione isso temporariamente:
  minHeight: 300,       // Se o problema for altura, isso vai forçar o laranja a aparecer
},

tituloSecao: {
  fontSize: 22,
  fontFamily: 'Inter-Bold', // Mesma fonte do Carrossel
  color: '#333333',
  marginLeft: 16,
  marginTop: 10,      // Alinhado com a borda do InfoBanner e do Carrossel
  // Espaço antes de começar os cards de produtos
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