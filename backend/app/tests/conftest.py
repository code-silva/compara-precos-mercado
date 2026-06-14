import pytest
from django.contrib.gis.geos import Point
from model_bakery import baker
from rest_framework.test import APIClient

from app.models import BranchProductOffer, BranchSupermarket, ParentSupermarket

# Sqlite doesn't support composite unique contraint.
# So I had to remove it from testing
if hasattr(BranchSupermarket._meta, "constraints"):
    BranchSupermarket._meta.constraints = [
        c
        for c in BranchSupermarket._meta.constraints
        if c.name != "unique_coordinates_parent_supermarket"
    ]


@pytest.fixture(autouse=True)
def register_gis_generator():
    baker.generators.add("django.contrib.gis.db.models.fields.PointField", lambda: Point(0, 0))


@pytest.fixture
def api_client():
    """Fixture to provide the DRF client."""
    return APIClient()


@pytest.fixture
def parent_supermarket(db):
    return baker.make(ParentSupermarket, name="Super Market")


@pytest.fixture
def branch_supermarket(db, parent_supermarket):
    """Creates a branch store at a specific coordinate and links an offer to it."""
    branch = baker.make(
        BranchSupermarket,
        parent_supermarket=parent_supermarket,
        state="DF",
        city="Gama",
        address="Gama Sul, QI 01",
        coordinates=Point(-47.9292, -15.7801),
    )

    baker.make(BranchProductOffer, branch_supermarket=branch)

    return branch


@pytest.fixture
def supermarkets_list(db):
    """Creates multiple supermarkets to test sorting and filters, with offers linked."""

    parent_supermarkets = baker.make(ParentSupermarket, _quantity=5)
    branch_supermarkets = []

    for parent in parent_supermarkets:
        branch = baker.make(
            BranchSupermarket,
            parent_supermarket=parent,
            state="DF",
            city="Gama",
            address="Gama Sul",
        )
        baker.make(BranchProductOffer, branch_supermarket=branch)

        branch_supermarkets.append(branch)

    branch_supermarkets.sort(key=lambda x: x.parent_supermarket.name)

    return branch_supermarkets


@pytest.fixture
def offers_list(db, parent_supermarket):
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
            branch_supermarket__state="DF",
            branch_supermarket__city="Gama",
            branch_supermarket__address="Gama Sul, QI 01",
            branch_supermarket__coordinates=Point(-47.9292, -15.7801, srid=4326),
        ),
        baker.make(
            BranchProductOffer,
            product__name="feijão",
            product__category=category2,
            branch_supermarket__parent_supermarket=parent_supermarket,
            branch_supermarket__state="DF",
            branch_supermarket__city="Gama",
            branch_supermarket__address="Gama Sul, QI 01",
            branch_supermarket__coordinates=Point(-47.9292, -15.7801, srid=4326),
        ),
        baker.make(
            BranchProductOffer,
            product__name="danone",
            product__category=category3,
            branch_supermarket__parent_supermarket=parent_supermarket,
            branch_supermarket__state="DF",
            branch_supermarket__city="Gama",
            branch_supermarket__address="Gama Sul, QI 01",
            branch_supermarket__coordinates=Point(-47.9292, -15.7801, srid=4326),
        ),
    ]

    offers.sort(key=lambda x: x.product.category.priority)
    return offers
