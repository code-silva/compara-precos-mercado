from rest_framework import serializers

from .models import MercadoFilial


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
