from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination 
from .models import Produto_Oferta_Filial
from .serializers import ProdutoOfertaSerializer

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
