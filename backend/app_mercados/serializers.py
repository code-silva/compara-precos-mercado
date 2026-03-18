from rest_framework import serializers
from .models import Produto, MercadoFilial, Produto_Oferta_Filial

"""
o serializer transforma o que seria um campo com um ID e busca na tabela de onde o ID
veio para retornar o valor que passamos e entrega no final um json
"""

class OfertaProdutoSerializer(serializers.ModelSerializer):
    produto_nome = serializers.ReadOnlyField(source='produto.nome')
    produto_marca = serializers.ReadOnlyField(source='produto.marca')
    produto_imagem = serializers.ImageField(source='produto.imagem', read_only=True)
    mercado_nome = serializers.ReadOnlyField(source='mercado_filial.mercado_matriz.nome')
    cidade = serializers.ReadOnlyField(source='mercado_filial.localidade.cidade')

    class Meta:
        model = Produto_Oferta_Filial
        fields = ['id', 'preco', 'produto_nome', 'produto_marca', 'produto_imagem', 'mercado_nome', 'cidade']

class ProdutoSerializer(serializers.ModelSerializer):
    categoria_nome = serializers.ReadOnlyField(source='categoria.nome')

    class Meta:
        model = Produto
        fields = ['id', 'nome', 'marca', 'medida', 'unidade_medida', 'categoria_nome', 'imagem']

class MercadoSerializer(serializers.ModelSerializer):
    nome_exibicao = serializers.ReadOnlyField(source='mercado_matriz.nome')
    cidade = serializers.ReadOnlyField(source='localidade.cidade')
    uf = serializers.ReadOnlyField(source='localidade.uf')

    class Meta:
        model = MercadoFilial
        fields = ['id', 'nome_exibicao', 'cidade', 'uf', 'coordenadas']
