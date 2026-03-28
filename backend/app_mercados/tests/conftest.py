import pytest
from django.contrib.gis.geos import Point
from model_bakery import baker
from rest_framework.test import APIClient

from app_mercados.models import Localidade, MercadoFilial, MercadoMatriz


@pytest.fixture(autouse=True)
def register_gis_generator():
    baker.generators.add('django.contrib.gis.db.models.fields.PointField', lambda: Point(0, 0))


@pytest.fixture
def client():
    """Fixture para fornecer o client do DRF."""
    return APIClient()


@pytest.fixture
def location(db):
    return baker.make(Localidade, uf='DF', cidade='Gama')


@pytest.fixture
def parent_supermarket(db):
    return baker.make(MercadoMatriz, nome='Mercado Super')


@pytest.fixture
def subsidiary_supermarket(db, location, parent_supermarket):
    """Cria uma filial em uma coordenada específica."""
    return baker.make(
        MercadoFilial,
        mercado_matriz=parent_supermarket,
        localidade=location,
        coordenadas=Point(-47.9292, -15.7801)
    )

@pytest.fixture
def supermarkets_array(db):
    """Cria múltiplos mercados para testar ordenação e filtros."""

    parents = baker.make(MercadoMatriz, _quantity=5)
    subsidiaries = [baker.make(MercadoFilial, mercado_matriz=parent) for parent in parents]
    subsidiaries.sort(key=lambda x: x.mercado_matriz.nome)

    return subsidiaries
