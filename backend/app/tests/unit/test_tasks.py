from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from app.tasks import scrap_home_page, scrap_supermarket_page

FIXTURES_DIRECTORY = Path(__file__).parent.parent / "fixtures"


@pytest.fixture
def mock_flyers_directory(tmp_path, monkeypatch):
    """
    Makes sure to use the 'tmp' directory from pytest, so that it is cleaned
    automatically after testing, preventing host machine pollution.
    """
    monkeypatch.setattr("app.tasks.FLYERS_BASE_DIR", tmp_path)
    return tmp_path


@pytest.fixture
def home_page_html_content():
    """
    Returns the home page HTML string content, read from the fixtures/home_page.html file.
    """
    return (FIXTURES_DIRECTORY / "home_page.html").read_text(encoding="utf-8")


@pytest.fixture
def supermarket_page_html_content():
    """
    Returns the supermarket page HTML string content,
    read from the fixtures/supermarket_page.html file.
    """
    return (FIXTURES_DIRECTORY / "supermarket_page.html").read_text(encoding="utf-8")


@pytest.mark.django_db
class TestScrapHomePageTask:
    """
    Class destined to the elaboration of tests of the 'scrap_home_page' task.
    """

    @patch("app.tasks.scrap_supermarket_page.delay")
    @patch("app.tasks.requests.get")
    def test_scrap_home_page_with_real_snapshot(
        self, mock_requests_get, mock_task_delay, home_page_html_content, mock_flyers_directory
    ):
        """
        Testing the home page scraping logic using a real HTML snapshot.
        It should parse the HTML correctly and queue the valid supermarkets.
        """

        mocked_response = MagicMock()
        mocked_response.status_code = 200
        mocked_response.text = home_page_html_content
        mock_requests_get.return_value = mocked_response

        scrap_home_page()

        assert mock_task_delay.call_count > 0

        first_queued_url = mock_task_delay.call_args_list[0][0][0]
        assert "encartesdf.com.br" in first_queued_url


@pytest.mark.django_db
class TestScrapSupermarketPageTask:
    """
    Class destined to the elaboration of tests of the 'scrap_supermarket_page' task.
    """

    @patch("app.tasks.requests.get")
    def test_scrap_supermarket_page_with_real_snapshot(
        self, mock_requests_get, supermarket_page_html_content, mock_flyers_directory
    ):
        """
        Testing the supermarket page scraping logic using a real HTML snapshot.
        It should mock the image downloading and save the files in the temporary directory.
        """

        mocked_html_response = MagicMock()
        mocked_html_response.status_code = 200
        mocked_html_response.text = supermarket_page_html_content

        mocked_image_response = MagicMock()
        mocked_image_response.status_code = 200
        mocked_image_response.iter_content.return_value = [b"fake_image_bytes"]

        def mocked_response_router(url_requested, *arguments, **keyword_arguments):
            """
            Routes the mocked response based on the requested URL string.
            Returns the HTML object for the main page and the bytes object for the image sources.
            """

            if "encartesdf.com.br" in url_requested:
                return mocked_html_response

            return mocked_image_response

        mock_requests_get.side_effect = mocked_response_router

        supermarket_target_url = "https://encartesdf.com.br/mercado-teste-real/"

        scrap_supermarket_page(supermarket_target_url)

        # Verifying if the directory was created successfully by the task
        created_directories = list(mock_flyers_directory.glob("mercado-teste-real_*"))
        assert len(created_directories) == 1

        temporary_folder = created_directories[0]
        saved_image_files = list(temporary_folder.glob("*.jpg"))
        assert len(saved_image_files) > 0
