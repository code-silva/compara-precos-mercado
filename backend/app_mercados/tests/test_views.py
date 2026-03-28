from django.urls import reverse


class TestMercadoFilialListView:
    """
    Class destined to the elaboration of tests of 'MercadoFilialListView' view.
    """

    URL = reverse("mercados-proximos")

    def test_with_longitude_equals_to_none(self, client, supermarkets_array):
        """
        Testing when longitude is not informed.
        It should return an ordered supermarket's list.
        """

        response = client.get(
            self.URL,
            {
                "latitude": -15.32,
                "longitude": "",
            },
        )

        results = response.data["results"]

        for idx in range(len(results)):
            supermarket_name = results[idx]["nome"]
            assert supermarket_name == supermarkets_array[idx].mercado_matriz.nome

    def test_with_latitude_equals_to_none(self, client, supermarkets_array):
        """
        Testing when latitude is not informed.
        It should return an ordered supermarket's list.
        """

        response = client.get(
            self.URL,
            {
                "latitude": "",
                "longitude": -15.32,
            },
        )

        results = response.data["results"]

        for idx in range(len(results)):
            supermarket_name = results[idx]["nome"]
            assert supermarket_name == supermarkets_array[idx].mercado_matriz.nome

    def test_with_user_not_in_radius(self, client, supermarkets_array):
        """
        Testing when the user is not within determined radius.
        It should return an ordered supermarket's list.
        """

        response = client.get(self.URL, {"latitude": -15.7801, "longitude": -47.9292})

        results = response.data["results"]

        for idx in range(len(results)):
            supermarket_name = results[idx]["nome"]
            assert supermarket_name == supermarkets_array[idx].mercado_matriz.nome

    def test_with_user_within_radius(self, client, subsidiary_supermarket):
        """
        Testing when the user is within determined radius.
        It should return the supermarkets close to the user.
        """

        response = client.get(self.URL, {"latitude": -15.7801, "longitude": -47.9292})

        results = response.data["results"]

        assert len(results) == 1
        assert results[0]["nome"] == subsidiary_supermarket.mercado_matriz.nome
