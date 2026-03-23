# Create your views here.
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point
from django.contrib.postgres.search import TrigramSimilarity
from django.db.models import Q
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import MercadoFilial, Produto_Oferta_Filial
from .serializers import (
    MercadoFilialSerializer,
    OfertaProdutoSerializer,
    ProdutoOfertaSerializer,
)


class BuscaHibridaView(APIView):

    def get(self, request):
        query = request.GET.get('q', '').strip()
        TAXA_SIMILARIDADE = 0.25

        if not query:
            return Response({"ofertas": [], "mercados": []})

        ofertas = Produto_Oferta_Filial.objects.annotate(
            sim_nome=TrigramSimilarity('produto__nome', query),
            sim_marca=TrigramSimilarity('produto__marca', query)
        ).filter(
            Q(produto__nome__icontains=query) |
            Q(produto__marca__icontains=query) |
            Q(produto__categoria__nome__icontains=query) |
            Q(sim_nome__gt=TAXA_SIMILARIDADE) |
            Q(sim_marca__gt=TAXA_SIMILARIDADE)
        ).select_related(
            'produto', 'mercado_filial__mercado_matriz', 'mercado_filial__localidade'
        ).order_by('-sim_nome')

        mercados = MercadoFilial.objects.annotate(
            sim_nome=TrigramSimilarity('mercado_matriz__nome', query)
        ).filter(
            Q(mercado_matriz__nome__icontains=query) |
            Q(localidade__cidade__icontains=query) |
            Q(sim_nome__gt=TAXA_SIMILARIDADE)
        ).select_related('mercado_matriz', 'localidade')

        return Response({
            "ofertas": OfertaProdutoSerializer(ofertas, many=True).data,
            "mercados": MercadoFilialSerializer(mercados, many=True).data
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


class OfertasPagination(PageNumberPagination):
    page_size = 14
    page_size_query_param = 'page_size'
    max_page_size = 100

class Produto_Oferta_FilialListView(generics.ListAPIView):
    serializer_class = ProdutoOfertaSerializer
    pagination_class = OfertasPagination

    def get_queryset(self):
        # 1. Sua Hierarquia de Categorias (Matches com o Supabase)
        ORDEM_PRIORIDADE = [
            'ALIMENTOS',
            'ALIMENTOS BÁSICOS',
            'FRIOS E LATICÍNIOS',
            'BEBIDAS',
            'HORTIFRUTI',
            'LIMPEZA',
            'OUTROS'
        ]

        # 2. QuerySet com Joins para performance
        queryset = Produto_Oferta_Filial.objects.all().select_related(
            'produto', 'produto__categoria',
            'mercado_filial', 'mercado_filial__mercado_matriz'
        )

        # 3. RECEBE POR PROXIMIDADE PRIMEIRO
        lat = self.request.query_params.get('lat')
        lon = self.request.query_params.get('lon')

        if lat and lon:
            try:
                user_location = Point(float(lon), float(lat), srid=4326)
                # O banco já nos entrega a lista ordenada do mais perto para o mais longe
                queryset = queryset.annotate(
                    distancia=Distance('mercado_filial__coordenadas', user_location)
                ).order_by('distancia')
            except (ValueError, TypeError):
                queryset = queryset.order_by('id')
        else:
            queryset = queryset.order_by('id')

        # 4. TRANSFORMA EM LISTA (A proximidade já está garantida aqui)
        lista_por_proximidade = list(queryset)

        # 5. AGRUPA POR CATEGORIA (Preservando a ordem de proximidade dentro do grupo)
        categorias_dict = {}
        for item in lista_por_proximidade:
            nome_cat = str(item.produto.categoria.nome).strip().upper()
            if nome_cat not in categorias_dict:
                categorias_dict[nome_cat] = []
            # Como lista_por_proximidade está ordenada, o primeiro item
            # adicionado aqui será o mais próximo desta categoria.
            categorias_dict[nome_cat].append(item)

        # 6. MONTA OS ITERADORES SEGUINDO A HIERARQUIA
        iteradores = []
        for nome in ORDEM_PRIORIDADE:
            if nome in categorias_dict:
                # Criamos uma tupla (nome, iterador) para saber o que estamos tirando
                iteradores.append({
                    'nome': nome,
                    'it': iter(categorias_dict.pop(nome))
                })

        # Categorias extras
        for nome, lista in categorias_dict.items():
            iteradores.append({
                'nome': nome,
                'it': iter(lista)
            })

        # 7. EXIBE COM INTERCALAÇÃO REAL
        resultado_final = []
        while iteradores:
            for i in range(len(iteradores) - 1, -1, -1):
                try:
                    item = next(iteradores[i]['it'])
                    resultado_final.append(item)
                except StopIteration:
                    iteradores.pop(i) # Remove a categoria que esgotou

        return resultado_final
