import logging
import tempfile
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from celery import chord, shared_task

from .models import Offer

logger = logging.getLogger(__name__)

FLYERS_BASE_DIR = Path(tempfile.gettempdir()) / "flyers"


@shared_task
def scrap_supermarket_page(url: str):
    """
    Scrapes a specific supermarket page and downloads all available flyer images.
    This task runs in parallel for each supermarket link found on the landing index.
    It collects and returns execution statistics to feed the final orchestration report.
    """

    FLYERS_BASE_DIR.mkdir(parents=True, exist_ok=True)
    market_slug = url.strip("/").split("/")[-1]

    # metrics dictionary to be used in the final summary report
    metrics = {
        "market": market_slug,
        "status": "success",
        "downloaded_images": 0,
        "reason": ""
    }

    try:
        # If this supermarket link has already been scrapped, we skip
        if Offer.objects.filter(url=url).exists():
            metrics["status"] = "skipped"
            metrics["reason"] = "Already processed"
            return metrics

        response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Creating a temporary folder to download the supermarket's flyers
        new_temp_folder = Path(
            tempfile.mkdtemp(
                prefix=f"{market_slug}_",
                dir=FLYERS_BASE_DIR,
            )
        )

        # Represent the flyers list in the page
        img_tags = soup.select_one(".text").find_next("p").select("img")
        download_count = 0

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

        # Updating metrics for the final summary report
        metrics["downloaded_images"] = download_count
        return metrics

    except Exception as e:
        logger.error(f"Error when scraping the Supermarket page ({url}): {e}")

        # Capturing the failure details to include in the final report
        metrics["status"] = "error"
        metrics["reason"] = str(e)
        return metrics


@shared_task
def generate_scraping_report(results):
    """
    Triggered automatically by Celery if and only when
    every single queued supermarket task completes execution.
    """

    if not results:
        logger.warning("No scraping results collected for the report.")
        return

    total_markets = len(results)
    total_images = sum(item["downloaded_images"] for item in results if item)
    successful_markets = sum(
        1 for item in results if item and item["status"] == "success"
    )
    skipped_markets = sum(
        1 for item in results if item and item["status"] == "skipped"
    )
    failed_markets = sum(
        1 for item in results if item and item["status"] == "error"
    )

    report = f"""
======================================================================
📊 FINAL SCRAPING REPORT - Compare prices
======================================================================
🏁 Execution Status: COMPLETED
🏪 Total Establishments Evaluated: {total_markets}
✅ Supermarkets Processed Successfully: {successful_markets}
⏩ Supermarkets Skipped (Existing Data): {skipped_markets}
❌ Supermarkets with Execution Errors: {failed_markets}
🖼️ Total Images/Flyers Downloaded: {total_images}

----------------------------------------------------------------------
📋 Detailed Breakdown per Establishment:
----------------------------------------------------------------------
"""
    for item in results:
        if not item:
            continue
        icons = {
            "success": "✅",
            "skipped": "⏩",
            "error": "❌",
        }
        status_icon = icons.get(item["status"], icons["error"])
        reason_str = f" ({item['reason']})" if item['reason'] else ""
        report += (
            f"  {status_icon} {item['market'].upper()}:"
            f" {item['downloaded_images']} image(s) saved{reason_str}\n"
        )

    report += "======================================================================"

    print(report)
    logger.info("Scraping workflow completed execution.")


@shared_task
def scrap_home_page():
    """
    This function scraps the home page of the "https://encartesdf.com.br/" URL.
    For each supermarket link found, it compiles a chord execution graph
    to trigger a unified summary report once all downloads finish.
    """

    URL = "https://encartesdf.com.br/"
    FLYERS_BASE_DIR.mkdir(parents=True, exist_ok=True)

    try:
        response = requests.get(URL, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Each supermarket link ('a' tag) is located in the following 'h1' tags.
        h1_tags = soup.select(".main-title")

        # Array created to accumulate task signatures for the chord pipeline
        tasks_to_run = []

        for h1_tag in h1_tags:
            a_tag = h1_tag.select_one("a")

            # If there's no supermarket link, we skip
            if not a_tag:
                continue

            # If the supermarket offer is expired, we skip
            if a_tag.select_one(".badge-vencido"):
                continue

            market_url = a_tag.get("href")

            # Appending active scraping tasks to the batch signature array
            tasks_to_run.append(scrap_supermarket_page.s(market_url))

        # Launching the parallel execution group and binding it to the report callback
        if tasks_to_run:
            logger.info(f"Home Page analysis finished. Launching chord workflow for {len(tasks_to_run)} tasks.")
            chord(tasks_to_run)(generate_scraping_report.s())
        else:
            logger.info("No active supermarket offers found to process.")

    except Exception as e:
        logger.error(f"Error when scraping the Home Page: {e}")

