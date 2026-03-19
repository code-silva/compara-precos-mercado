from django.urls import path

from .views import BuscaHibridaView, MercadoFilialListView

urlpatterns = [
    path('busca/', BuscaHibridaView.as_view(), name='busca_hibrida'),
    path("mercados-proximos/", MercadoFilialListView.as_view(), name="mercados-proximos"),
]

