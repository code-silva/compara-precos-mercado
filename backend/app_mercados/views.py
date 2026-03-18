from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point
from rest_framework import generics

from .models import MercadoFilial
from .serializers import MercadoFilialSerializer


class MercadoFilialListView(generics.ListAPIView):
    """
    View responsável por retornar os mercados ao frontend, num raio de até 5Km
    do usuário. Esta view SEMPRE retorna uma lista de objetos."""

    # Estou definindo quem será o serializador nessa view
    # Significa que o retorno dessa view serão os campos definidos neste serializer
    serializer_class = MercadoFilialSerializer

    # Método responsável por retornar dados ao frontend
    def get_queryset(self):

        # 'latitude' e 'longitude' são parâmetros passados pelo frontend mobile
        latitude_usuario = self.request.query_params.get("latitude")
        longitude_usuario = self.request.query_params.get("longitude")

        # Se o usuário não informar sua localização, o retorno será de mercados
        # em ordem alfabética
        if not latitude_usuario or not longitude_usuario:
            return MercadoFilial.objects.all().order_by("mercado_matriz__nome")

        # Caso a localização seja informada, vou tentar converter a localização do usuário
        # para o objeto Point(), compatível com o banco de dados
        try:
            ponto_usuario = Point(float(longitude_usuario), float(latitude_usuario), srid=4326)

            return (
                MercadoFilial.objects.filter(coordenadas__dwithin=(ponto_usuario, 5000))
                .annotate(distancia=Distance("coordenadas", ponto_usuario))
                .order_by("distancia")
            )

        # Se não for possível definir sua localização, então será retornado a lista
        # de mercados ordenadas por nome
        except ValueError:
            return MercadoFilial.objects.all().order_by("mercado_matriz__nome")
