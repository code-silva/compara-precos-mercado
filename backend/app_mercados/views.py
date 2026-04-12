from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point
from django.contrib.postgres.search import TrigramSimilarity
from django.db.models import Q
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import MercadoFilial, Produto_Oferta_Filial
from .pagination import MercadoFilialPagination, OfertasPagination
from .serializers import (
    MercadoFilialSerializer,
    OfertaProdutoSerializer,
    ProdutoOfertaSerializer,
)


class BuscaHibridaView(APIView):
    def get(self, request):
        query = request.GET.get("q", "").strip()
        TAXA_SIMILARIDADE = 0.25

        if not query:
            return Response({"ofertas": [], "mercados": []})

        ofertas = (
            Produto_Oferta_Filial.objects.annotate(
                sim_nome=TrigramSimilarity("produto__nome", query),
                sim_marca=TrigramSimilarity("produto__marca", query),
            )
            .filter(
                Q(produto__nome__icontains=query)
                | Q(produto__marca__icontains=query)
                | Q(produto__categoria__nome__icontains=query)
                | Q(sim_nome__gt=TAXA_SIMILARIDADE)
                | Q(sim_marca__gt=TAXA_SIMILARIDADE)
            )
            .select_related(
                "produto", "mercado_filial__mercado_matriz", "mercado_filial__localidade"
            )
            .order_by("-sim_nome")
        )

        mercados = (
            MercadoFilial.objects.annotate(
                sim_nome=TrigramSimilarity("mercado_matriz__nome", query)
            )
            .filter(
                Q(mercado_matriz__nome__icontains=query)
                | Q(localidade__cidade__icontains=query)
                | Q(sim_nome__gt=TAXA_SIMILARIDADE)
            )
            .select_related("mercado_matriz", "localidade")
        )

        return Response(
            {
                "ofertas": OfertaProdutoSerializer(ofertas, many=True).data,
                "mercados": MercadoFilialSerializer(mercados, many=True).data,
            }
        )


class MercadoFilialListView(generics.ListAPIView):
    """
    View responsável por retornar os mercados ao frontend, num raio de até 5Km
    do usuário. Esta view SEMPRE retorna uma lista de objetos."""

    serializer_class = MercadoFilialSerializer
    pagination_class = MercadoFilialPagination

    def get_queryset(self):
        user_latitude = self.request.query_params.get("latitude")
        user_longitude = self.request.query_params.get("longitude")

        queryset_base = MercadoFilial.objects.select_related(
            "mercado_matriz",
            "localidade",
        ).all()

        # If the user doesn't inform his location, it'll return the supermarkets
        # ordered alphabetically.
        if not user_latitude or not user_longitude:
            return queryset_base.order_by("mercado_matriz__nome")

        try:
            user_location = Point(float(user_longitude), float(user_latitude), srid=4326)

        # If it's not possible to define user's location, it'll return the supermarkets
        # ordered alphabetically.
        except (ValueError, TypeError):
            return queryset_base.order_by("mercado_matriz__nome")

        RADIUS = 5000  # Maximum radius in meters
        results = (
            queryset_base.filter(coordenadas__dwithin=(user_location, RADIUS))
            .annotate(distancia=Distance("coordenadas", user_location))
            .order_by("distancia")
        )

        if not results:
            return queryset_base.order_by("mercado_matriz__nome")

        return results


class Produto_Oferta_FilialListView(generics.ListAPIView):
    serializer_class = ProdutoOfertaSerializer
    pagination_class = OfertasPagination

    def get_queryset(self):
        queryset = Produto_Oferta_Filial.objects.select_related(
            "produto",
            "produto__categoria",
            "mercado_filial__mercado_matriz"
        )

        user_latitude = self.request.query_params.get("lat")
        user_longitude = self.request.query_params.get("lon")
        supermarket_id = self.request.query_params.get("supermarket_id")

        if supermarket_id:
            queryset = queryset.filter(mercado_filial__id=supermarket_id)

        try:
            if user_latitude and user_longitude:
                user_location = Point(
                    float(user_longitude),
                    float(user_latitude),
                    srid=4326
                )
                search_radius_meters = 5000

                queryset = (
                    queryset.filter(
                        mercado_filial__coordenadas__dwithin=(user_location, search_radius_meters)
                    )
                    .annotate(distancia=Distance("mercado_filial__coordenadas", user_location))
                    .order_by("produto__categoria__prioridade", "distancia")
                )
            else:
                queryset = queryset.order_by("produto__categoria__prioridade")

        except (ValueError, TypeError):
            queryset = queryset.order_by("produto__categoria__prioridade")

        return queryset