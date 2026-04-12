from rest_framework.pagination import PageNumberPagination


class MercadoFilialPagination(PageNumberPagination):
    page_size = 6
    max_page_size = 30


class OfertasPagination(PageNumberPagination):
    page_size = 15
    page_size_query_param = "page_size"
    max_page_size = 100
