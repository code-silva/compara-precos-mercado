import pytest
import requests
from bs4 import BeautifulSoup


@pytest.mark.integration
class TestEncartesDFMonitoring:
    """
    Class destined to the elaboration of integration tests of
    'https://encartesdf.com.br/' website. It is used to check
    if the connection is ok, and if its HTML layout remains the
    same.
    """

    HOME_PAGE_URL = "https://encartesdf.com.br/"

    def test_if_home_page_remains_the_same(self):
        """
        Checks if it's possible to access the home page, and if its HTML
        remains the same.
        """

        response = requests.get(self.HOME_PAGE_URL, headers={"User-Agent": "Mozilla/5.0"})
        assert response.status_code == 200, "The home page is not accessible."

        soup = BeautifulSoup(response.text, "html.parser")
        h1_tags = soup.select(".main-title")
        assert len(h1_tags) > 0, "The HTML layout of the home page has changed."

        first_a_tag = h1_tags[0].select_one("a")
        assert first_a_tag is not None, "The HTML layout of the home page has changed."
        assert "href" in first_a_tag.attrs, "The HTML layout of the home page has changed."
