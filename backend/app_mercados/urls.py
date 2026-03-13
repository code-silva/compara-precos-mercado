from django.urls import path
from .views import BuscaHibridaView

urlpatterns = [
    path('busca/', BuscaHibridaView.as_view(), name='busca_hibrida'),
]