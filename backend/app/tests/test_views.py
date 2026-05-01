from django.urls import reverse


class TestBranchSupermarketListView:
    """
    Class destined to the elaboration of tests of 'BranchSupermarketListView' view.
    """

    URL = reverse("nearby_markets")

    def test_with_longitude_missing(self, client, supermarkets_list):
        """
        Testing when longitude is not informed.
        It should return an ordered supermarket list.
        """

        response = client.get(
            self.URL,
            {
                "latitude": -15.32,
                "longitude": "",
            },
        )

        results = response.data["results"]

        for index in range(len(results)):
            supermarket_name = results[index]["name"]
            assert supermarket_name == supermarkets_list[index].parent_supermarket.name

    def test_with_latitude_missing(self, client, supermarkets_list):
        """
        Testing when latitude is not informed.
        It should return an ordered supermarket list.
        """

        response = client.get(
            self.URL,
            {
                "latitude": "",
                "longitude": -15.32,
            },
        )

        results = response.data["results"]

        for index in range(len(results)):
            supermarket_name = results[index]["name"]
            assert supermarket_name == supermarkets_list[index].parent_supermarket.name

    def test_with_user_outside_radius(self, client, supermarkets_list):
        """
        Testing when the user is not within determined radius.
        It should return an ordered supermarket list.
        """

        response = client.get(self.URL, {"latitude": -15.7801, "longitude": -47.9292})

        results = response.data["results"]

        for index in range(len(results)):
            supermarket_name = results[index]["name"]
            assert supermarket_name == supermarkets_list[index].parent_supermarket.name

    def test_with_user_inside_radius(self, client, branch_supermarket):
        """
        Testing when the user is within determined radius.
        It should return the supermarkets close to the user.
        """

        response = client.get(self.URL, {"latitude": -15.7801, "longitude": -47.9292})

        results = response.data["results"]

        assert len(results) == 1
        assert results[0]["name"] == branch_supermarket.parent_supermarket.name