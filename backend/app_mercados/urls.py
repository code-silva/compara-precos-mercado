from django.urls import path
from .views import BuscaHibridaView

urlpatterns = [
    path('busca/', BuscaHibridaView.as_views(), name='busca_hibrida'),
]