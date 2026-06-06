import requests
from bs4 import BeautifulSoup
from celery import shared_task
from .models import Offer


@shared_task
def scrap_home_page():
    """
    This function scraps the home page of the "https://encartesdf.com.br/" URL.
    For each supermarket link found, it'll be added in the Redis queue for scraping
    later.
    """

    URL = "https://encartesdf.com.br/"

    try:
        response = requests.get(URL, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(response.text, 'html.parser')

        # Each supermarket link ('a' tag) is located in the following 'h1' tags.
        h1_tags = soup.select('.main-title')

        for h1_tag in h1_tags:

            a_tag = h1_tag.select_one('a')

            # If there's no supermarket link, we skip
            if not a_tag:
                continue

            # If the supermarket offer is expired, we skip
            if a_tag.select_one('.badge-vencido'):
                continue

            # If this supermarket link has already been scrapped, we skip
            if Offer.objects.filter(url=a_tag.get('href')).exists():
                continue

            # Queueing in Redis
            # scrap_supermarket_page.delay(a_tag.get('href'))


    except Exception as e:
        print(f"\033[91mThere was an error when scraping the Home Page: {e}\033[0m")


