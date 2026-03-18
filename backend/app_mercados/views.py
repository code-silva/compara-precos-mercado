# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point
from django.db.models import Q
from django.contrib.postgres.search import TrigramSimilarity
from .models import Produto_Oferta_Filial, MercadoFilial
from .serializers import OfertaProdutoSerializer, MercadoSerializer, MercadoFilialSerializer

class BuscaHibridaView(APIView):
    def get(self, request):
        query = request.GET.get('q', '').strip()

        if not query:
            return Response({"ofertas": [], "mercados": []})
        
        ofertas = Produto_Oferta_Filial.objects.annotate(
            sim_nome=TrigramSimilarity('produto__nome', query),
            sim_marca=TrigramSimilarity('produto__marca', query)
        ).filter(
            Q(produto__nome__icontains=query) |
            Q(produto__marca__icontains=query) |
            Q(produto__categoria__nome__icontains=query) |
            Q(sim_nome__gt=0.15) |  # aceita resultados com 15% de semelhança
            Q(sim_marca__gt=0.15)
        ).select_related(
            'produto', 'mercado_filial__mercado_matriz', 'mercado_filial__localidade'
        ).order_by('-sim_nome')

        mercados = MercadoFilial.objects.annotate(
            sim_nome=TrigramSimilarity('mercado_matriz__nome', query)
        ).filter(
            Q(mercado_matriz__nome__icontains=query) |
            Q(localidade__cidade__icontains=query) |
            Q(sim_nome__gt=0.15)
        ).select_related('mercado_matriz', 'localidade')

        return Response({
            "ofertas": OfertaProdutoSerializer(ofertas, many=True).data,
            "mercados": MercadoSerializer(mercados, many=True).data
        })
      
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
