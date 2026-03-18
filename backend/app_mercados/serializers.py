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

class MercadoFilialSerializer(serializers.ModelSerializer):
    """
    Serializador responsável por retornar as informações da entidade 'MercadoFilial'
    de forma legível para o frontend mobile (JSON).

    É retornado:

    {
        "id": Identificador único do mercado,
        "nome": Nome do mercado,
        "latitude": Coordenada y da localização do mercado,
        "longitude": Coordenada x da localização do mercado,
        "uf": Estado em que o mercado está localizado,
        "cidade": Cidade em que o mercado está localizado,
        "distancia_km": Distância em linha reta até o usuário
    }

    """

    class Meta:
        # Campos que serão serializados (enviados para o frontend)
        fields = ["id", "nome", "latitude", "longitude", "uf", "cidade", "distancia_km"]
        model = MercadoFilial

    nome = serializers.CharField(source="mercado_matriz.nome", read_only=True)
    latitude = serializers.FloatField(source="coordenadas.y", read_only=True)
    longitude = serializers.FloatField(source="coordenadas.x", read_only=True)
    uf = serializers.CharField(source="localidade.uf", read_only=True)
    cidade = serializers.CharField(source="localidade.cidade", read_only=True)

    # Este atributo não existe na entidade 'MercadoFilial', mas é
    # necessário para calcular a distância entre o usuário e os mercados.
    # Assim, esse atributo será calculado e deteminado pelo método 'get_<atributo>',
    # ou seja, 'get_distancia_km'.
    distancia_km = serializers.SerializerMethodField()

    # Método que define o valor do atributo 'distancia_km'
    def get_distancia_km(self, obj_mercado_filial):

        # 'distancia' é o campo virtual definido pelo 'annotate'
        if hasattr(obj_mercado_filial, "distancia") and obj_mercado_filial.distancia is not None:
            return round(obj_mercado_filial.distancia.km, 2)
        return None

    class Meta:
        model = MercadoFilial
        fields = ['id', 'nome_exibicao', 'cidade', 'uf', 'coordenadas']
