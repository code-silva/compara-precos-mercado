# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.postgres.search import TrigramSimilarity
from .models import Produto_Oferta_Filial, MercadoFilial
from .serializers import OfertaProdutoSerializer, MercadoSerializer

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