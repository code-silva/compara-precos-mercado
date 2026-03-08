from django.urls import path

from .views import MercadoFilialListView

urlpatterns = [
    path("mercados/proximos/", MercadoFilialListView.as_view(), name="mercados-proximos")
]
