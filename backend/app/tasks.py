import requests
from bs4 import BeautifulSoup
from celery import shared_task
import tempfile
from pathlib import Path
from .models import Offer

FLYERS_BASE_DIR = Path(tempfile.gettempdir()) / "flyers"

@shared_task
def scrap_supermarket_page(url: str):
    """
    This function visits the given supermarket URL and downloads all the flyers
    of the page into a temporary directory.
    """

    FLYERS_BASE_DIR.mkdir(parents=True, exist_ok=True)

    try:
        # If this supermarket link has already been scrapped, we skip
        if Offer.objects.filter(url=url).exists():
            return

        response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Creating a temporary folder to download the supermarket's flyers
        new_temp_folder = Path(
            tempfile.mkdtemp(
                prefix=f"{url.strip('/').split('/')[-1]}_",
                dir=FLYERS_BASE_DIR,
            )
        )

        img_tags = soup.select_one('.text').find_next('p').select('img')

        # Looping through all flyers found in the page
        for index, img_tag in enumerate(img_tags):

            src = img_tag.get('data-src') or img_tag.get('src')
            if not src:
                continue

            # Trying to download the flyer image
            response = requests.get(src, stream=True)
            if response.status_code != 200:
                continue

            file_name = f"{index:02d}.jpg"
            file_path = new_temp_folder / file_name

            # Saving the image in a temp file
            with open(file_path, 'wb') as file:
                for chunk in response.iter_content(1024):
                    file.write(chunk)
            
    except Exception as e:
        print(f"\033[91mThere was an error when scraping the Supermarket page: {e}\033[0m")


@shared_task
def scrap_home_page():
    """
    This function scraps the home page of the "https://encartesdf.com.br/" URL.
    For each supermarket link found, it'll be added in the Redis queue for scraping
    later.
    """

    URL = "https://encartesdf.com.br/"
    FLYERS_BASE_DIR.mkdir(parents=True, exist_ok=True)

    try:
        response = requests.get(URL, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()

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
            scrap_supermarket_page.delay(a_tag.get('href'))


    except Exception as e:
        print(f"\033[91mThere was an error when scraping the Home Page: {e}\033[0m")
