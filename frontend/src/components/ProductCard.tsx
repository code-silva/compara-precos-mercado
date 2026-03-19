import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Produto } from '../types/product';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { memo } from 'react';

/**
 * Interface 'Propriedades':
 * Define o "contrato ou regras" de dados que o componente CardProduto deve receber.
 * No React, é conhecido como'Props'. Sempre que alguém usar o CardProduto,
 * o TypeScript exigirá que esses três itens sejam passados.
 */

interface Propriedades {
  produto: Produto;
  aoPressionar: () => void;
  aoAdicionarNaLista: () => void;
}

/**
 * Componente 'CardProduto':
 * Representa a interface visual de um item da lista de compras.
 * * Suas Funcionalidades principais são:
 * 1. Exibição de Dados: Renderiza informações do 'produto' (imagem, nome, preço e mercado).
 
 * 2. Interatividade: 
 * - O card inteiro é clicável (aoPressionar) para ver detalhes.
 * - Possui um botão específico (aoAdicionarNaLista) para salvar o item.
 
 * 3. Estrutura: Utiliza 'React.FC' (Functional Component) com TypeScript para garantir
 * que todas as propriedades obrigatórias sejam recebidas corretamente.
 **/
 

const CardProduto: React.FC<Propriedades> = ({ produto, aoPressionar, aoAdicionarNaLista }) => {
  return (
  <TouchableOpacity style={estilos.cartao} onPress={aoPressionar} activeOpacity={0.9}>
    
    {/* 1. Container da Imagem + Preço Canto superior direito */}
    {/* Esta View serve para que o preço saiba que deve flutuar dentro dela */}
    <View style={estilos.containerImagem}>
      <Image 
        source={{ uri: produto.imagem }} 
        style={estilos.imagemProduto} 
        resizeMode="contain"
      />  
      
      {/* Rótulo de Ranking (canto superior esquerdo) */}
      <View style={estilos.seloRanking}>
        <Text style={estilos.textoRanking}>#{produto.ranking || produto.id}</Text>
      </View>

      {/* Rótulo de Preço */}
      <View style={estilos.rotuloPreco}>
        <Text style={estilos.textoPreco}>
          R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
        </Text>
      </View>

      {/* Botão Adicionar à Lista */}
      <TouchableOpacity style={estilos.botaoAdicionar} onPress={aoAdicionarNaLista}>
        <MaterialCommunityIcons name="playlist-plus" size={24} color="#28a8b5" />
      </TouchableOpacity>

    </View>

    <View style={estilos.containerInformacoes}>
  
      {/* Nome do Produto */}
      <Text style={estilos.nomeProduto}>
        {produto.nome_produto}
      </Text>

      {/* Marca (Coca - Cola) */}
      <Text style={estilos.estiloMarca}>
        {produto.marca}
      </Text>

      {/* 3. Rodapé da descrição: Peso + Mercado */}
      <View style={estilos.linhaRodape}>
        {/* Só renderiza a etiqueta se a medida existir */}
        {produto.unidade_medida && (
        <View style={estilos.etiquetaPeso}>
         <Text style={estilos.textoPeso}>
            {produto.unidade_medida} 
          </Text>
        </View>
      )}
    
        <Text style={estilos.nomeMercado} numberOfLines={1}>
          {produto.nome_mercado}
        </Text>
      </View>

      {produto.distancia_km !== undefined && (
        <View style={estilos.containerDistancia}>
          <MaterialCommunityIcons name="map-marker-distance" size={14} color="#666" />
          <Text style={estilos.textoDistancia}>
            {produto.distancia_km} km
          </Text>
        </View>
      )}

    </View>

  </TouchableOpacity>
);
};

const estilos = StyleSheet.create({
  cartao: {
    width: '92%', // Ocupa quase toda a largura, deixando um espaço nas laterais
    maxWidth: 400, // Não deixa o card ficar gigante em tablets
    backgroundColor: '#fff',
    borderRadius: 21.6,
    padding: 10.8,
    marginVertical: 16,
    alignSelf: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4.3 },
    shadowOpacity: 0.25,
    shadowRadius: 4.3,
  },
  containerImagem: {
  width: '100%',
  aspectRatio: 1, // Altura usada na imagem
  position: 'relative', // Importante para o preço flutuar aqui dentro
  overflow: 'hidden',
  borderRadius: 10,
  marginBottom: 10,
  backgroundColor: '#f5f5f5', // Fundo leve para destacar produtos brancos
  padding: 70, // Cria espaço entre o fundo cinza e a imagem (faça o teste com 15, 20 ou 25)
  },
  imagemProduto: {
    width: '100%',
    height: '100%',
  },
  nomeProduto: {
    fontFamily: 'Inter-Bold', // Usando a fonte Inter, negrito para destacar o nome
    fontSize: 18,
    color: '#333',
    flexShrink: 1, // Permite que o nome encolha se for muito longo, evitando overflow
  },
  seloRanking: {
  // 1. Posicionamento absoluto dentro do containerImagem
  position: 'absolute',
  top: 10,  // Distância do topo
  left: 10, // Distância da esquerda (oposto ao preço)

  // 2. Visual do selo 
  backgroundColor: 'rgba(241, 241, 241, 0.9)', // Um cinza claro levemente transparente
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6,
  
  // Sombra leve para garantir leitura sobre fotos claras
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  },
  estiloMarca: {
  fontFamily: 'Inter-Regular', 
  fontSize: 15,
  color: '#2e2d2d', // Um cinza escuro para diferenciar do nome preto
  marginBottom: 4,
  },

  textoRanking: {
  fontSize: 12,
  color: '#666',
  fontFamily: 'Inter-Bold', // Usando a fonte Inter que configuramos
  },

  rotuloPreco: {
  
  minWidth: 70,
  height: 35,
  backgroundColor: '#28a8b5',
  borderRadius: 10.8,
  padding: 5,
  
  // Posicionamento absoluto (o "pulo do gato")
  position: 'absolute',
  top: 10,
  right: 10,
  
  // Alinhamento do texto
  justifyContent: 'center',
  alignItems: 'center',
  },

  textoPreco: {
  color: '#ffffff',
  fontWeight: 'bold',
  fontSize: 15,
  textAlign: 'center',
  },
 
  botaoAdicionar: {
  position: 'absolute',
  bottom: 16,
  alignSelf: 'center',
  
  // Dimensões circulares
  width: 42, 
  height: 42,
  borderRadius: 21, // Metade para ser círculo perfeito
  
  backgroundColor: '#FFFFFF',
  
  // Centraliza o ícone de adicionar perfeitamente
  justifyContent: 'center',
  alignItems: 'center',

  // Sombra para dar profundidade sobre o fundo cinza
  elevation: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 3,
  },
 
  containerInformacoes: {
    padding: 12,
    width: '100%',
  },

  marca: {
    fontFamily: 'Inter-Regular', // Marca em fonte regular ou semi-bold
    fontSize: 15,
    color: '#555', // Um cinza intermediário
    marginBottom: 4,
  },

  linhaRodape: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  etiquetaPeso: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  textoPeso: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: '#333',
  },
  nomeMercado: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    color: '#28a8b5',
    flex: 1, // Faz o nome do mercado ocupar o resto da linha e usar reticências se for longo
},

containerDistancia: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0', // Fundo cinza suave para combinar com o peso
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8, // Espaço entre o nome do mercado e a distância
  },

  textoDistancia: {
    fontFamily: 'Inter-Bold',
    fontSize: 11,
    color: '#666',
    marginLeft: 2, // Espaço entre o ícone e o número
  },
  
});

export default memo(CardProduto); // Exporta o componente memoizado para evitar re-renderizações desnecessárias