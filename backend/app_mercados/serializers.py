from rest_framework import serializers
from .models import Produto_Oferta_Filial

class ProdutoOfertaSerializer(serializers.ModelSerializer):
    # 'source' navega pelos relacionamentos: tabela.campo
    nome_produto = serializers.CharField(source='produto.nome')
    marca = serializers.CharField(source='produto.marca')
    imagem = serializers.ImageField(source='produto.imagem')
    # Unidade de medida do produto e formatada se necessário
    unidade_medida = serializers.CharField(source='produto.get_unidade_medida_display')
    medida = serializers.DecimalField(source='produto.medida', max_digits=10, decimal_places=2)
    # É buscado o nome do mercado na matriz através da filial
    nome_mercado = serializers.CharField(source='mercado_filial.mercado_matriz.nome')
    nome_categoria = serializers.CharField(source='produto.categoria.nome')

    class Meta:
        model = Produto_Oferta_Filial
        fields = [
            'id', 
            'nome_produto', 
            'marca', 
            'preco', 
            'imagem', 
            'unidade_medida', 
            'medida', 
            'nome_mercado', 
            'nome_categoria'
        ]