from rest_framework import serializers

from .models import MercadoFilial, Produto, Produto_Oferta_Filial

"""
o serializer transforma o que seria um campo com um ID e busca na tabela de onde o ID
veio para retornar o valor que passamos e entrega no final um json
"""


class OfertaProdutoSerializer(serializers.ModelSerializer):
    productName = serializers.ReadOnlyField(source="produto.nome")
    brand = serializers.ReadOnlyField(source="produto.marca")
    image = serializers.ImageField(source="produto.imagem", read_only=True)
    marketName = serializers.ReadOnlyField(source="mercado_filial.mercado_matriz.nome")
    city = serializers.ReadOnlyField(source="mercado_filial.localidade.city")

    class Meta:
        model = Produto_Oferta_Filial
        fields = [
            "id",
            "preco",
            "productName",
            "brand",
            "image",
            "marketName",
            "city",
        ]


class ProdutoSerializer(serializers.ModelSerializer):
    categoryName = serializers.ReadOnlyField(source="categoria.nome")

    class Meta:
        model = Produto
        fields = [
            "id",
            "nome",
            "marca",
            "medida",
            "unidade_medida",
            "categoria_nome",
            "imagem"
        ]


class MercadoFilialSerializer(serializers.ModelSerializer):
    """
    Serializador responsável por retornar as informações da entidade 'MercadoFilial'
    de forma legível para o frontend mobile (JSON).

    É retornado:

    {
        "id": Identificador único do mercado,
        "nome": Nome do mercado,
        "uf": Estado em que o mercado está localizado,
        "cidade": Cidade em que o mercado está localizado,
        "distancia_km": Distância em linha reta até o usuário
    }

    """

    class Meta:
        model = MercadoFilial
        fields = [
            "id",
            "name",
            "state",
            "city",
            "distanceInKilometers"
        ]

    name = serializers.CharField(source="mercado_matriz.nome", read_only=True)
    state = serializers.CharField(source="localidade.uf", read_only=True)
    city = serializers.CharField(source="localidade.cidade", read_only=True)

    distanceInKilometers = serializers.SerializerMethodField()

    # Método que define o valor do atributo 'distanceInKilometers'
    def get_distanceInKilometers(self, obj):
        # 'distancia' é o campo virtual definido pelo 'annotate'
        if hasattr(obj, "distancia") and obj.distancia is not None:
            return round(obj.distancia.km, 2)
        return None


class ProdutoOfertaSerializer(serializers.ModelSerializer):
    """
    Serializador responsável por retornar as informações da entidade 'Produto_Oferta_Filial'
    de forma estruturada e legível para o frontend mobile (JSON).
    Este serializador agrega dados de múltiplas entidades relacionadas: Produto,
    Categoria e Mercado.

    É retornado:

    {
        "id": Identificador único da oferta,
        "nome_produto": Nome do produto associado à oferta,
        "marca": Marca do produto,
        "preco": Preço atual do produto no mercado,
        "imagem": URL da imagem do produto,
        "unidade_medida": Unidade de medida do produto (ex: kg, un, L),
        "medida": Quantidade correspondente à unidade de medida,
        "nome_mercado": Nome do mercado onde a oferta está disponível,
        "nome_categoria": Categoria do produto,
        "distancia_km": Distância em linha reta até o usuário (quando disponível)
    }
    """

    productName = serializers.CharField(source="produto.nome", read_only=True)
    brand = serializers.CharField(source="produto.marca", read_only=True)
    image = serializers.ImageField(source="produto.imagem", read_only=True)

    measurementUnit = serializers.CharField(
        source="produto.get_unidade_medida_display", read_only=True
    )

    measurement = serializers.DecimalField(
        source="produto.medida", max_digits=10, decimal_places=2, read_only=True
    )

    marketName = serializers.CharField(
        source="mercado_filial.mercado_matriz.nome", read_only=True
    )

    categoryName = serializers.CharField(source="produto.categoria.nome", read_only=True)

    distanceInKilometers = serializers.SerializerMethodField()

    class Meta:
        model = Produto_Oferta_Filial
        fields = [
            "id",
            "productName",
            "brand",
            "preco",
            "image",
            "measurementUnit",
            "measurement",
            "marketName",
            "categoryName",
            "distanceInKilometers",
        ]

    def get_distanceInKilometers(self, obj):
        if hasattr(obj, "distancia"):
            return round(obj.distancia.km, 2)
        return None
