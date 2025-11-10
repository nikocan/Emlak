from typing import List, Dict, Any, Optional
from .base import BaseScraper
from loguru import logger
import re
import json


class EmlakjetScraper(BaseScraper):
    """Scraper for emlakjet.com"""

    def __init__(self):
        super().__init__()
        self.base_url = "https://www.emlakjet.com"
        self.source_name = "emlakjet"

    async def scrape_listings(
        self,
        city: str,
        district: Optional[str] = None,
        listing_type: str = "sale",
        property_type: str = "apartment",
        max_pages: int = 5,
    ) -> List[Dict[str, Any]]:
        """Scrape property listings from Emlakjet"""

        # Map property types
        property_map = {
            "apartment": "konut/satilik/daire",
            "villa": "konut/satilik/villa",
            "office": "isyeri/satilik/ofis",
            "land": "arsa/satilik",
        }

        if listing_type == "rent":
            property_map = {
                "apartment": "konut/kiralik/daire",
                "villa": "konut/kiralik/villa",
                "office": "isyeri/kiralik/ofis",
            }

        category = property_map.get(property_type, "konut/satilik/daire")

        # Build URL
        city_formatted = city.lower().replace(" ", "-")
        if district:
            district_formatted = district.lower().replace(" ", "-")
            base_search_url = f"{self.base_url}/{category}/{city_formatted}/{district_formatted}"
        else:
            base_search_url = f"{self.base_url}/{category}/{city_formatted}"

        all_listings = []

        for page in range(1, max_pages + 1):
            url = f"{base_search_url}?page={page}"
            logger.info(f"Scraping Emlakjet page {page}: {url}")

            html = await self.fetch_page(url)
            if not html:
                break

            soup = self.parse_html(html)

            # Find all listing cards
            listings = soup.find_all(class_=re.compile("_3eAeQ|listing-item|property-card"))

            if not listings:
                logger.warning(f"No listings found on page {page}")
                break

            for listing in listings:
                try:
                    listing_data = self._parse_listing_card(listing, listing_type, property_type)
                    if listing_data:
                        all_listings.append(listing_data)
                except Exception as e:
                    logger.error(f"Error parsing listing: {str(e)}")
                    continue

            logger.info(f"Scraped {len(listings)} listings from page {page}")

        logger.info(f"Total listings scraped from Emlakjet: {len(all_listings)}")
        return all_listings

    def _parse_listing_card(
        self, listing, listing_type: str, property_type: str
    ) -> Optional[Dict[str, Any]]:
        """Parse a single listing card from search results"""

        try:
            # Get listing URL and ID
            link = listing.find("a", href=True)
            if not link:
                return None

            url = link.get("href")
            if not url.startswith("http"):
                url = self.base_url + url

            # Extract ID from URL
            id_match = re.search(r"/ilan/(\d+)", url)
            external_id = id_match.group(1) if id_match else None

            if not external_id:
                return None

            # Get title
            title_elem = listing.find(class_=re.compile("_3IjAk|title|heading"))
            title = title_elem.get_text(strip=True) if title_elem else ""

            # Get price
            price_elem = listing.find(class_=re.compile("_2TxNw|price"))
            price = None
            if price_elem:
                price_text = price_elem.get_text(strip=True)
                price = self.clean_price(price_text)

            # Get location
            location_elem = listing.find(class_=re.compile("_2TpLj|location"))
            location_text = location_elem.get_text(strip=True) if location_elem else ""

            # Parse location
            location_parts = [p.strip() for p in location_text.split("/")]
            district = location_parts[0] if location_parts else ""
            neighborhood = location_parts[1] if len(location_parts) > 1 else ""

            # Get property details
            details = listing.find_all(class_=re.compile("_18xfj|detail"))
            area_sqm = None
            rooms = None

            for detail in details:
                text = detail.get_text(strip=True)
                if "m²" in text or "m2" in text:
                    area_sqm = self.clean_number(text.replace("m²", "").replace("m2", ""))
                elif re.match(r"\d+\+\d+", text):
                    # Room format like "3+1"
                    parts = text.split("+")
                    rooms = sum(int(p) for p in parts if p.isdigit())

            # Get image
            img_elem = listing.find("img")
            thumbnail_url = None
            if img_elem:
                thumbnail_url = img_elem.get("src") or img_elem.get("data-src")

            return {
                "external_id": f"emlakjet_{external_id}",
                "source": "emlakjet",
                "source_url": url,
                "title": title,
                "price": price,
                "district": district,
                "neighborhood": neighborhood,
                "area_sqm": area_sqm,
                "rooms": rooms,
                "thumbnail_url": thumbnail_url,
                "listing_type": listing_type,
                "property_type": property_type,
            }

        except Exception as e:
            logger.error(f"Error in _parse_listing_card: {str(e)}")
            return None

    async def scrape_detail(self, url: str) -> Optional[Dict[str, Any]]:
        """Scrape detailed information from an Emlakjet property page"""

        html = await self.fetch_page(url)
        if not html:
            return None

        soup = self.parse_html(html)

        try:
            data = {
                "source": "emlakjet",
                "source_url": url,
            }

            # Extract ID from URL
            id_match = re.search(r"/ilan/(\d+)", url)
            if id_match:
                data["external_id"] = f"emlakjet_{id_match.group(1)}"

            # Get title
            title_elem = soup.find("h1", class_=re.compile("_1EzZl|title"))
            if title_elem:
                data["title"] = title_elem.get_text(strip=True)

            # Get price
            price_elem = soup.find(class_=re.compile("fiyat|_34O5X|price"))
            if price_elem:
                price_text = price_elem.get_text(strip=True)
                data["price"] = self.clean_price(price_text)

            # Get description
            desc_elem = soup.find(class_=re.compile("_1R9jt|description"))
            if desc_elem:
                data["description"] = desc_elem.get_text(strip=True)

            # Get property attributes
            attributes = soup.find_all(class_=re.compile("_2vQu2|ozellik-item|attribute"))
            features = {}

            for attr in attributes:
                text = attr.get_text(strip=True)
                if ":" in text:
                    parts = text.split(":", 1)
                    label = parts[0].strip()
                    value = parts[1].strip()

                    # Map common attributes
                    if "m²" in label or "Alan" in label:
                        data["area_sqm"] = self.clean_number(value.replace("m²", ""))
                    elif "Oda" in label:
                        if "+" in value:
                            parts = value.split("+")
                            data["rooms"] = sum(int(p) for p in parts if p.isdigit())
                            data["bedrooms"] = int(parts[0]) if parts[0].isdigit() else None
                        else:
                            data["rooms"] = self.clean_number(value)
                    elif "Bina Yaşı" in label:
                        age_text = value.split()[0]
                        if age_text.isdigit():
                            data["building_age"] = int(age_text)
                    elif "Kat" in label and "Toplam" not in label:
                        floor_match = re.search(r"(\d+)", value)
                        if floor_match:
                            data["floor"] = int(floor_match.group(1))
                    elif "Toplam Kat" in label or "Bina Kat" in label:
                        data["total_floors"] = self.clean_number(value)
                    elif "Banyo" in label:
                        data["bathrooms"] = self.clean_number(value)
                    elif "Isıtma" in label:
                        data["heating_type"] = value
                    elif "Eşyalı" in label:
                        data["furnished"] = "Evet" in value or "Yes" in value
                    else:
                        features[label] = value

            data["features"] = features

            # Get location
            location_elem = soup.find(class_=re.compile("_13dLc|konum|location"))
            if location_elem:
                location_text = location_elem.get_text(strip=True)
                location_parts = [p.strip() for p in location_text.split("/")]
                if len(location_parts) >= 1:
                    data["city"] = location_parts[0]
                if len(location_parts) >= 2:
                    data["district"] = location_parts[1]
                if len(location_parts) >= 3:
                    data["neighborhood"] = location_parts[2]

            # Get coordinates
            map_container = soup.find("div", {"data-lat": True, "data-lng": True})
            if map_container:
                data["latitude"] = float(map_container.get("data-lat"))
                data["longitude"] = float(map_container.get("data-lng"))
            else:
                # Try to find in script tags
                script_tags = soup.find_all("script")
                for script in script_tags:
                    if script.string and "mapCenter" in script.string:
                        coords = self.extract_coordinates(script.string)
                        if coords:
                            data["latitude"], data["longitude"] = coords
                            break

            # Get images
            images = []
            gallery = soup.find(class_=re.compile("_2DwTa|gallery|foto-galeri"))
            if gallery:
                img_elems = gallery.find_all("img")
                for img in img_elems:
                    img_url = img.get("src") or img.get("data-src")
                    if img_url and "http" in img_url:
                        images.append(img_url)

            if images:
                data["images"] = images
                data["thumbnail_url"] = images[0]

            # Get agent info
            agent_elem = soup.find(class_=re.compile("ilan-sahibi|agent"))
            if agent_elem:
                name_elem = agent_elem.find(class_=re.compile("name|isim"))
                if name_elem:
                    data["agent_name"] = name_elem.get_text(strip=True)

            return data

        except Exception as e:
            logger.error(f"Error scraping Emlakjet detail page: {str(e)}")
            return None
