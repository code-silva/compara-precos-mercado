from rest_framework import serializers
from .models import Produto_Oferta_Filial

class ProdutoOfertaSerializer(serializers.ModelSerializer):
    # read_only=True para evitar erros de validação em campos de outras tabelas
    nome_produto = serializers.CharField(source='produto.nome', read_only=True)
    marca = serializers.CharField(source='produto.marca', read_only=True)
    imagem = serializers.ImageField(source='produto.imagem', read_only=True)
    
    # O Django gera automaticamente o display para choices. 
    # Se o método falhar, use apenas source='produto.unidade_medida'
    unidade_medida = serializers.CharField(source='produto.get_unidade_medida_display', read_only=True)
    
    medida = serializers.DecimalField(source='produto.medida', max_digits=10, decimal_places=2, read_only=True)
    nome_mercado = serializers.CharField(source='mercado_filial.mercado_matriz.nome', read_only=True)
    nome_categoria = serializers.CharField(source='produto.categoria.nome', read_only=True)

    distancia_km = serializers.SerializerMethodField()

    class Meta:
        model = Produto_Oferta_Filial
        fields = [
            'id', 'nome_produto', 'marca', 'preco', 'imagem', 
            'unidade_medida', 'medida', 'nome_mercado', 
            'nome_categoria', 'distancia_km'
        ]

    # ESTA FUNÇÃO TEM QUE FICAR FORA DA META (alinhada com o class Meta)
    def get_distancia_km(self, obj):
        distancia = getattr(obj, 'distancia', None)
        print(f"DEBUG: Produto {obj.id} - Distancia: {distancia}")
        if distancia is not None:
            # Se for um objeto de distância do GeoDjango, usamos .km
            try:
                return round(distancia.km, 2)
            except AttributeError:
                # Caso o banco retorne apenas o número bruto (float)
                return round(float(distancia), 2)
        return None