from django.urls import path

from .views import BranchProductOfferListView, BranchSupermarketListView, HybridSearchView

urlpatterns = [
    path("search/", HybridSearchView.as_view(), name="search"),
    path("nearby-markets/", BranchSupermarketListView.as_view(), name="nearby_markets"),
    path("products/offers/", BranchProductOfferListView.as_view(), name="offers_list"),
]
