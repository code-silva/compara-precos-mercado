from rest_framework import serializers
from .models import Produto, MercadoFilial, Localidade, MercadoMatriz

"""
o serializer transforma o que seria um campo com um ID e busca na tabela de onde o ID
veio para retornar o valor que passamos e entrega no final um json
"""

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