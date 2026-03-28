from django.urls import path

from .views import BuscaHibridaView, MercadoFilialListView, Produto_Oferta_FilialListView

urlpatterns = [
    path("busca/", BuscaHibridaView.as_view(), name="busca_hibrida"),
    path("mercados-proximos/", MercadoFilialListView.as_view(), name="mercados-proximos"),
    path("produtos/ofertas/", Produto_Oferta_FilialListView.as_view(), name="lista-ofertas"),
]
