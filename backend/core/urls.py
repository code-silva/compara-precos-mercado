from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

# O segredo estava aqui: trocar 'app_produtos' por 'app_mercados'
from app_mercados.views import Produto_Oferta_FilialListView 

urlpatterns = [
    path("admin/", admin.site.urls),
    # Agora o Python vai encontrar a classe Produto_Oferta_FilialListView
    path('api/produtos/ofertas/', Produto_Oferta_FilialListView.as_view(), name='lista-ofertas'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
