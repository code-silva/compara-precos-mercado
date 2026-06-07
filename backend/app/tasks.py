import logging
import tempfile
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from celery import shared_task

from .models import Offer

logger = logging.getLogger(__name__)

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
            logger.debug(f"Supermarket URL already processed. Skipping: {url}")
            return

        response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        market_slug = url.strip("/").split("/")[-1]

        # Creating a temporary folder to download the supermarket's flyers
        new_temp_folder = Path(
            tempfile.mkdtemp(
                prefix=f"{market_slug}_",
                dir=FLYERS_BASE_DIR,
            )
        )

        logger.info(f"Created temporary directory for {market_slug}: {new_temp_folder}")

        img_tags = soup.select_one(".text").find_next("p").select("img")
        download_count = 0

        # Looping through all flyers found in the page
        for index, img_tag in enumerate(img_tags):
            src = img_tag.get("data-src") or img_tag.get("src")
            if not src:
                continue

            # Trying to download the flyer image
            response = requests.get(src, stream=True)
            if response.status_code != 200:
                logger.warning(f"Failed to download image {src} (Status: {response.status_code})")
                continue

            file_name = f"{index:02d}.jpg"
            file_path = new_temp_folder / file_name

            # Saving the image in a temp file
            with open(file_path, "wb") as file:
                for chunk in response.iter_content(1024):
                    file.write(chunk)

            download_count += 1

        logger.info(f"Successfully downloaded {download_count} flyers for {market_slug}")

    except Exception as e:
        logger.error(f"Error when scraping the Supermarket page ({url}): {e}")


@shared_task
def scrap_home_page():
    """
    This function scraps the home page of the "https://encartesdf.com.br/" URL.
    For each supermarket link found, it'll be added in the Redis queue for scraping
    later.
    """

    URL = "https://encartesdf.com.br/"
    FLYERS_BASE_DIR.mkdir(parents=True, exist_ok=True)

    logger.info("Starting Home Page scraping process...")

    try:
        response = requests.get(URL, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Each supermarket link ('a' tag) is located in the following 'h1' tags.
        h1_tags = soup.select(".main-title")
        queued_count = 0

        for h1_tag in h1_tags:
            a_tag = h1_tag.select_one("a")

            # If there's no supermarket link, we skip
            if not a_tag:
                continue

            # If the supermarket offer is expired, we skip
            if a_tag.select_one(".badge-vencido"):
                logger.debug(f"Skipping expired offer: {a_tag.text.strip()}")
                continue

            market_url = a_tag.get("href")

            # If this supermarket link has already been scrapped, we skip
            if Offer.objects.filter(url=market_url).exists():
                logger.debug(f"Offer already exists in database. Skipping: {market_url}")
                continue

            logger.info(f"Queueing new supermarket for scraping: {market_url}")

            # Queueing in Redis
            scrap_supermarket_page.delay(market_url)
            queued_count += 1

        logger.info(f"Home Page scraping finished. {queued_count} tasks queued.")

    except Exception as e:
        logger.error(f"Error when scraping the Home Page: {e}")
