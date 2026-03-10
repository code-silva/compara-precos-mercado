# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import Produto, MercadoFilial
from .serializers import ProdutoSerializer, MercadoSerializer

class BuscaHibridaView(APIView):
    def get(self, request):
        query = request.GET.get('q', '').strip()

        if not query:
            return Response({"produtos": [], "mercados": []})
        
        # busca por produto nos campos nome, marca, categoria
        produtos = Produto.objects.filter(
            Q(nome__icontains=query) |
            Q(marca__icontains=query) |
            Q(categoria__nome__icontains=query)
        ).distinct
