import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Produto } from '../types/product';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { memo } from 'react';

interface Propriedades {
  produto: Produto;
  aoPressionar: (produto: Produto) => void;      
  aoAdicionarNaLista: (produto: Produto) => void; 
  ehGrade?: boolean;
}

const CardProduto: React.FC<Propriedades> = ({ produto, aoPressionar, aoAdicionarNaLista, ehGrade }) => {
  
  const distanciaFormatada = React.useMemo(() => {
    if (produto.distancia_km === undefined || produto.distancia_km === null) return null;
    
    const valor = Number(produto.distancia_km);
    if (valor < 1) {
      return `${Math.ceil(valor * 1000)} m`;
    }
    return `${valor.toFixed(1)} km`;
  }, [produto.distancia_km]);

  return (
    <TouchableOpacity 
      style={[
        estilos.cartao, 
        ehGrade ? estilos.estiloGrade : estilos.estiloLista
      ]} 
      onPress={() => aoPressionar(produto)} 
      activeOpacity={0.9}
    >
      <View style={estilos.containerImagem}>
        <Image
          source={{ uri: produto.imagem || 'https://via.placeholder.com/150' }}
          style={estilos.imagemProduto}
          resizeMode="contain"
        />

        <View style={estilos.seloRanking}>
          <Text style={estilos.textoRanking}>#{produto.ranking || produto.id}</Text>
        </View>

        <View style={[
            estilos.rotuloPreco, 
            ehGrade && { minWidth: undefined, height: 23, paddingHorizontal: 6, top: 10, right: 6 }
        ]}>
          <Text style={[estilos.textoPreco, ehGrade && { fontSize: 11 }]}>
            R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
          </Text>
        </View>

        {/* Retornando o botão para o centro/posição original conforme solicitado */}
        <TouchableOpacity 
            style={[
              estilos.botaoAdicionar, 
              ehGrade && { width: 30, height: 30, borderRadius: 15, bottom: 8 }
            ]} 
            onPress={() => aoAdicionarNaLista(produto)}
        >
          <MaterialCommunityIcons 
            name="playlist-plus" 
            size={ehGrade ? 20 : 24} 
            color="#28a8b5" 
          />
        </TouchableOpacity>
      </View>

      <View style={estilos.containerInformacoes}>
        <View style={ehGrade ? { height: 44, justifyContent: 'center' } : null}>
          <Text 
            style={[estilos.nomeProduto, ehGrade && { fontSize: 13, lineHeight: 16 }]} 
            numberOfLines={2}
          >
            {produto.nome_produto}
          </Text>
        </View>

        <View style={ehGrade ? { height: 20, justifyContent: 'center', marginTop: 2 } : null}>
          <Text style={estilos.estiloMarca} numberOfLines={1}>
            {produto.marca}
          </Text>
        </View>

        <View style={[estilos.linhaRodape, ehGrade && { marginTop: 5 }]}>
          {produto.unidade_medida && (
            <View style={estilos.etiquetaPeso}>
              <Text style={estilos.textoPeso}>{produto.unidade_medida}</Text>
            </View>
          )}

          <Text style={estilos.nomeMercado} numberOfLines={1}>
            {produto.nome_mercado}
          </Text>
        </View>

        {distanciaFormatada && (
          <View style={estilos.containerDistancia}>
            <MaterialCommunityIcons name="map-marker-distance" size={12} color="#666" />
            <Text style={estilos.textoDistancia}>{distanciaFormatada}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 10,
    elevation: 4,
    // Removendo as sombras web que causaram confusão visual
  },

  estiloLista: {
    width: '100%', 
    maxWidth: 450,
    alignSelf: 'center',
    marginVertical: 12,
  },

  estiloGrade: {
    flex: 1,
    margin: 8,
    padding: 8,
    minHeight: 280,
  },

  containerImagem: {
    width: '100%',
    aspectRatio: 1, 
    position: 'relative', 
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: 5,
    backgroundColor: '#f9f9f9', 
    justifyContent: 'center',
    alignItems: 'center',
  },

  imagemProduto: {
    width: '85%',
    height: '85%',
  },

  nomeProduto: {
    fontWeight: '700',
    fontSize: 14,
    color: '#333',
  },

  seloRanking: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
  },

  textoRanking: {
    fontSize: 10,
    color: '#888',
    fontWeight: 'bold',
  },

  rotuloPreco: {
    minWidth: 65,
    paddingVertical: 4,
    backgroundColor: '#28a8b5',
    borderRadius: 6,
    position: 'absolute',
    top: 8,
    right: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoPreco: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 12,
  },

  botaoAdicionar: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  containerInformacoes: {
    paddingVertical: 4,
    flex: 1,
  },

  estiloMarca: {
    fontSize: 11,
    color: '#888',
    textTransform: 'uppercase',
  },

  linhaRodape: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  etiquetaPeso: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginRight: 6,
  },

  textoPeso: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },

  nomeMercado: {
    fontSize: 11,
    fontWeight: '700',
    color: '#28a8b5',
    flex: 1,
  },

  containerDistancia: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  textoDistancia: {
    fontSize: 11,
    color: '#999',
    marginLeft: 3,
    fontWeight: '600',
  },
});

export default memo(CardProduto);