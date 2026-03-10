# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import Produto_Oferta_Filial, MercadoFilial
from .serializers import OfertaProdutoSerializer, MercadoSerializer

class BuscaHibridaView(APIView):
    def get(self, request):
        query = request.GET.get('q', '').strip()

        if not query:
            return Response({"ofertas": [], "mercados": []})
        
        # busca por ofertas nos campos nome, marca, categoria
        ofertas = Produto_Oferta_Filial.objects.filter(
            Q(nome__icontains=query) |
            Q(marca__icontains=query) |
            Q(categoria__nome__icontains=query)
        ).select_related('produto', 'mercado_filial__mercado_matriz', 'mercado_filial__localidade')


        mercados = MercadoFilial.objects.filter(
            Q(mercado_matriz__nome__icontains=query) |
            Q(localidade__cidade__icontains=query)
        ).select_related('mercado_matriz', 'localidade')

        return Response({
            "ofertas": OfertaProdutoSerializer(ofertas, many=True).data,
            "mercados": MercadoSerializer(mercados, many=True).data
        })