from rest_framework import serializers

from .models import MercadoFilial, Produto, Produto_Oferta_Filial

"""
o serializer transforma o que seria um campo com um ID e busca na tabela de onde o ID
veio para retornar o valor que passamos e entrega no final um json
"""


class OfertaProdutoSerializer(serializers.ModelSerializer):
    produto_nome = serializers.ReadOnlyField(source="produto.nome")
    produto_marca = serializers.ReadOnlyField(source="produto.marca")
    produto_imagem = serializers.ImageField(source="produto.imagem", read_only=True)
    mercado_nome = serializers.ReadOnlyField(source="mercado_filial.mercado_matriz.nome")
    cidade = serializers.ReadOnlyField(source="mercado_filial.localidade.cidade")

    class Meta:
        model = Produto_Oferta_Filial
        fields = [
            "id",
            "preco",
            "produto_nome",
            "produto_marca",
            "produto_imagem",
            "mercado_nome",
            "cidade",
        ]


class ProdutoSerializer(serializers.ModelSerializer):
    categoria_nome = serializers.ReadOnlyField(source="categoria.nome")

    class Meta:
        model = Produto
        fields = ["id", "nome", "marca", "medida", "unidade_medida", "categoria_nome", "imagem"]


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
        # Campos que serão serializados (enviados para o frontend)
        fields = ["id", "name", "uf", "city", "distance_km"]
        model = MercadoFilial

    name = serializers.CharField(source="mercado_matriz.nome", read_only=True)
    uf = serializers.CharField(source="localidade.uf", read_only=True)
    city = serializers.CharField(source="localidade.cidade", read_only=True)

    # Esse atributo será calculado e deteminado pelo método 'get_<atributo>'
    distance_km = serializers.SerializerMethodField()

    # Método que define o valor do atributo 'distancia_km'
    def get_distance_km(self, obj):
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

    nome_produto = serializers.CharField(source="produto.nome", read_only=True)
    marca = serializers.CharField(source="produto.marca", read_only=True)
    imagem = serializers.ImageField(source="produto.imagem", read_only=True)

    unidade_medida = serializers.CharField(
        source="produto.get_unidade_medida_display", read_only=True
    )

    medida = serializers.DecimalField(
        source="produto.medida", max_digits=10, decimal_places=2, read_only=True
    )

    nome_mercado = serializers.CharField(
        source="mercado_filial.mercado_matriz.nome", read_only=True
    )

    nome_categoria = serializers.CharField(source="produto.categoria.nome", read_only=True)

    distancia_km = serializers.SerializerMethodField()

    class Meta:
        model = Produto_Oferta_Filial
        fields = [
            "id",
            "nome_produto",
            "marca",
            "preco",
            "imagem",
            "unidade_medida",
            "medida",
            "nome_mercado",
            "nome_categoria",
            "distancia_km",
        ]

    def get_distancia_km(self, obj):
        if hasattr(obj, "distancia"):
            return round(obj.distancia.km, 2)
        return None
