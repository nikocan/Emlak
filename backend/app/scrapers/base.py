from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from bs4 import BeautifulSoup
import httpx
from loguru import logger
import asyncio


class BaseScraper(ABC):
    """Base scraper class for real estate websites"""

    def __init__(self):
        self.source_name = self.__class__.__name__.replace("Scraper", "").lower()
        self.base_url = ""
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
        }

    @abstractmethod
    async def scrape_listings(
        self,
        city: str,
        district: Optional[str] = None,
        listing_type: str = "sale",
        property_type: str = "apartment",
        max_pages: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        Scrape property listings from the website

        Args:
            city: City name (e.g., 'istanbul')
            district: District name (optional)
            listing_type: 'sale' or 'rent'
            property_type: Type of property
            max_pages: Maximum number of pages to scrape

        Returns:
            List of property dictionaries
        """
        pass

    @abstractmethod
    async def scrape_detail(self, url: str) -> Optional[Dict[str, Any]]:
        """
        Scrape detailed information from a property listing page

        Args:
            url: URL of the property detail page

        Returns:
            Dictionary with property details
        """
        pass

    async def fetch_page(self, url: str, timeout: int = 30) -> Optional[str]:
        """
        Fetch a webpage with retry logic

        Args:
            url: URL to fetch
            timeout: Request timeout in seconds

        Returns:
            HTML content or None if failed
        """
        max_retries = 3
        for attempt in range(max_retries):
            try:
                async with httpx.AsyncClient(headers=self.headers, timeout=timeout) as client:
                    response = await client.get(url)
                    response.raise_for_status()
                    return response.text
            except httpx.HTTPError as e:
                logger.warning(
                    f"Attempt {attempt + 1}/{max_retries} failed for {url}: {str(e)}"
                )
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)  # Exponential backoff
                else:
                    logger.error(f"Failed to fetch {url} after {max_retries} attempts")
                    return None

    def parse_html(self, html: str) -> BeautifulSoup:
        """
        Parse HTML content with BeautifulSoup

        Args:
            html: HTML content

        Returns:
            BeautifulSoup object
        """
        return BeautifulSoup(html, "lxml")

    def clean_price(self, price_str: str) -> Optional[float]:
        """
        Clean and convert price string to float

        Args:
            price_str: Price string (e.g., '1.500.000 TL')

        Returns:
            Price as float or None
        """
        try:
            # Remove common Turkish price formatting
            cleaned = (
                price_str.replace("TL", "")
                .replace("₺", "")
                .replace(".", "")
                .replace(",", ".")
                .strip()
            )
            return float(cleaned)
        except (ValueError, AttributeError):
            return None

    def clean_number(self, num_str: str) -> Optional[float]:
        """
        Clean and convert number string to float

        Args:
            num_str: Number string

        Returns:
            Number as float or None
        """
        try:
            cleaned = num_str.replace(".", "").replace(",", ".").strip()
            return float(cleaned)
        except (ValueError, AttributeError):
            return None

    def extract_coordinates(self, text: str) -> Optional[tuple[float, float]]:
        """
        Extract latitude and longitude from text

        Args:
            text: Text containing coordinates

        Returns:
            Tuple of (latitude, longitude) or None
        """
        import re

        # Look for patterns like: 41.0082, 28.9784
        pattern = r"(-?\d+\.\d+),\s*(-?\d+\.\d+)"
        match = re.search(pattern, text)
        if match:
            lat, lng = float(match.group(1)), float(match.group(2))
            return (lat, lng)
        return None

    async def scrape_with_rate_limit(
        self, urls: List[str], delay: float = 1.0
    ) -> List[Optional[Dict[str, Any]]]:
        """
        Scrape multiple URLs with rate limiting

        Args:
            urls: List of URLs to scrape
            delay: Delay between requests in seconds

        Returns:
            List of scraped data
        """
        results = []
        for url in urls:
            result = await self.scrape_detail(url)
            results.append(result)
            await asyncio.sleep(delay)
        return results

    def validate_property_data(self, data: Dict[str, Any]) -> bool:
        """
        Validate that property data has required fields

        Args:
            data: Property data dictionary

        Returns:
            True if valid, False otherwise
        """
        required_fields = [
            "external_id",
            "title",
            "price",
            "city",
            "district",
            "latitude",
            "longitude",
        ]
        return all(field in data and data[field] is not None for field in required_fields)
