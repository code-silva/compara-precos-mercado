import pytest
from django.contrib.gis.geos import Point
from model_bakery import baker
from rest_framework.test import APIClient

from app.models import BranchSupermarket, Location, ParentSupermarket


@pytest.fixture(autouse=True)
def register_gis_generator():
    baker.generators.add("django.contrib.gis.db.models.fields.PointField", lambda: Point(0, 0))


@pytest.fixture
def client():
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
