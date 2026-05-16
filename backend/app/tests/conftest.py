import pytest
from django.contrib.gis.geos import Point
from model_bakery import baker
from rest_framework.test import APIClient

from app.models import BranchSupermarket, Location, ParentSupermarket, BranchProductOffer


@pytest.fixture(autouse=True)
def register_gis_generator():
    baker.generators.add("django.contrib.gis.db.models.fields.PointField", lambda: Point(0, 0))


@pytest.fixture
def api_client():
    """Fixture to provide the DRF client."""
    return APIClient()


@pytest.fixture
def location(db):
    return baker.make(Location, state="DF", city="Gama")


@pytest.fixture
def parent_supermarket(db):
    return baker.make(ParentSupermarket, name="Super Market")


@pytest.fixture
def branch_supermarket(db, location, parent_supermarket):
    """Creates a branch store at a specific coordinate."""
    return baker.make(
        BranchSupermarket,
        parent_supermarket=parent_supermarket,
        location=location,
        coordinates=Point(-47.9292, -15.7801),
    )


@pytest.fixture
def supermarkets_list(db):
    """Creates multiple supermarkets to test sorting and filters."""

    parent_supermarkets = baker.make(ParentSupermarket, _quantity=5)
    branch_supermarkets = [
        baker.make(BranchSupermarket, parent_supermarket=parent)
        for parent in parent_supermarkets
    ]
    branch_supermarkets.sort(key=lambda x: x.parent_supermarket.name)

    return branch_supermarkets


@pytest.fixture
def offers_list(db, location, parent_supermarket):
    """
    Returns an offers list for testing (from BracnProductOffer model).
    """

    category1 = baker.make("app.Category", priority=1)
    category2 = baker.make("app.Category", priority=2)
    category3 = baker.make("app.Category", priority=3)

    offers = [
        baker.make(
            BranchProductOffer,
            product__name="arroz",
            product__category=category1,
            branch_supermarket__parent_supermarket=parent_supermarket,
            branch_supermarket__location=location,
            branch_supermarket__coordinates=Point(-47.9292, -15.7801, srid=4326),
        ),
        baker.make(
            BranchProductOffer,
            product__name="feijão",
            product__category=category2,
            branch_supermarket__parent_supermarket=parent_supermarket,
            branch_supermarket__location=location,
            branch_supermarket__coordinates=Point(-47.9292, -15.7801, srid=4326),
        ),
        baker.make(
            BranchProductOffer,
            product__name="danone",
            product__category=category3,
            branch_supermarket__parent_supermarket=parent_supermarket,
            branch_supermarket__location=location,
            branch_supermarket__coordinates=Point(-47.9292, -15.7801, srid=4326),
        ),
    ]

    offers.sort(key=lambda x: x.product.category.priority)
    return offers