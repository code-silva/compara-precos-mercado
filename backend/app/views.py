from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point
from django.contrib.postgres.search import TrigramSimilarity
from django.db.models import Q
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import BranchProductOffer, BranchSupermarket
from .pagination import BranchSupermarketPagination, OffersPagination
from .serializers import (
    BranchProductOfferSerializer,
    BranchSupermarketSerializer,
)


class HybridSearchView(APIView):
    """
    View responsible for performing a unified search across both product offers and
    supermarkets. It uses trigram similarity and text filtering to find relevant
    results based on names, brands, or categories.
    """

    def get(self, request):
        query = request.GET.get("query", "").strip()
        SIMILARITY_THRESHOLD = 0.25

        if not query:
            return Response({"offers": [], "supermarkets": []})

        offers = (
            BranchProductOffer.objects.annotate(
                similarity_name=TrigramSimilarity("product__name", query),
                similarity_brand=TrigramSimilarity("product__brand", query),
            )
            .filter(
                Q(product__name__icontains=query)
                | Q(product__brand__icontains=query)
                | Q(product__category__name__icontains=query)
                | Q(similarity_name__gt=SIMILARITY_THRESHOLD)
                | Q(similarity_brand__gt=SIMILARITY_THRESHOLD)
            )
            .select_related(
                "product",
                "product__category",
                "branch_supermarket__parent_supermarket",
                "branch_supermarket__location"
            )
            .order_by("-similarity_name")
        )

        supermarkets = (
            BranchSupermarket.objects.annotate(
                similarity_name=TrigramSimilarity("parent_supermarket__name", query)
            )
            .filter(
                Q(parent_supermarket__name__icontains=query)
                | Q(location__city__icontains=query)
                | Q(similarity_name__gt=SIMILARITY_THRESHOLD)
            )
            .select_related("parent_supermarket", "location")
        )

        return Response(
            {
                "search_term": query,
                "offers": BranchProductOfferSerializer(offers, many=True).data,
                "supermarkets": BranchSupermarketSerializer(supermarkets, many=True).data,
            }
        )


class BranchSupermarketListView(generics.ListAPIView):
    """
    View responsible for returning supermarkets to the frontend, within a radius of up to 5km
    from the user. This view ALWAYS returns a list of objects.
    """

    serializer_class = BranchSupermarketSerializer
    pagination_class = BranchSupermarketPagination

    def get_queryset(self):
        user_latitude = self.request.query_params.get("latitude")
        user_longitude = self.request.query_params.get("longitude")

        base_queryset = BranchSupermarket.objects.select_related(
            "parent_supermarket",
            "location",
        ).all()

        if not user_latitude or not user_longitude:
            return base_queryset.order_by("parent_supermarket__name")

        try:
            user_location = Point(float(user_longitude), float(user_latitude), srid=4326)

        except (ValueError, TypeError):
            return base_queryset.order_by("parent_supermarket__name")

        MAXIMUM_RADIUS_METERS = 5000
        results = (
            base_queryset.filter(coordinates__dwithin=(user_location, MAXIMUM_RADIUS_METERS))
            .annotate(distance=Distance("coordinates", user_location))
            .order_by("distance")
        )

        if not results:
            return base_queryset.order_by("parent_supermarket__name")

        return results


class BranchProductOfferListView(generics.ListAPIView):
    serializer_class = BranchProductOfferSerializer
    pagination_class = OffersPagination

    def get_queryset(self):
        queryset = BranchProductOffer.objects.select_related(
            "product", "product__category", "branch_supermarket__parent_supermarket"
        )

        user_latitude = self.request.query_params.get("latitude")
        user_longitude = self.request.query_params.get("longitude")
        supermarket_identifier = self.request.query_params.get("supermarket_id")

        if supermarket_identifier:
            queryset = queryset.filter(branch_supermarket__id=supermarket_identifier)

        try:
            if user_latitude and user_longitude:
                user_location = Point(float(user_longitude), float(user_latitude), srid=4326)
                search_radius_meters = 5000

                queryset = (
                    queryset.filter(
                        branch_supermarket__coordinates__dwithin=(
                            user_location,
                            search_radius_meters,
                        )
                    )
                    .annotate(distance=Distance("branch_supermarket__coordinates", user_location))
                    .order_by("product__category__priority", "distance")
                )
            else:
                queryset = queryset.order_by("product__category__priority")

        except (ValueError, TypeError):
            queryset = queryset.order_by("product__category__priority")

        return queryset
