from django.urls import path

from .views import BuscaHibridaView, MercadoFilialListView, Produto_Oferta_FilialListView

urlpatterns = [
    path("busca/", BuscaHibridaView.as_view(), name="search"),
    path("nearby-markets/", MercadoFilialListView.as_view(), name="nearby_markets"),
    path("products/offers/", Produto_Oferta_FilialListView.as_view(), name="offers_list"),
]
