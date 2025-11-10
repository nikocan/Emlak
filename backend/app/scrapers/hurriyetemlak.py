from typing import List, Dict, Any, Optional
from .base import BaseScraper
from loguru import logger
import re
import json


class HurriyetEmlakScraper(BaseScraper):
    """Scraper for hurriyetemlak.com"""

    def __init__(self):
        super().__init__()
        self.base_url = "https://www.hurriyetemlak.com"
        self.source_name = "hurriyetemlak"

    async def scrape_listings(
        self,
        city: str,
        district: Optional[str] = None,
        listing_type: str = "sale",
        property_type: str = "apartment",
        max_pages: int = 5,
    ) -> List[Dict[str, Any]]:
        """Scrape property listings from Hürriyet Emlak"""

        # Map property types
        property_map = {
            "apartment": "daire",
            "villa": "villa",
            "office": "ofis",
            "land": "arsa",
        }

        listing_type_map = {"sale": "satilik", "rent": "kiralik"}

        prop_type = property_map.get(property_type, "daire")
        list_type = listing_type_map.get(listing_type, "satilik")

        # Build URL
        city_formatted = city.lower().replace(" ", "-")
        if district:
            district_formatted = district.lower().replace(" ", "-")
            base_search_url = (
                f"{self.base_url}/{list_type}-{prop_type}/{city_formatted}/{district_formatted}"
            )
        else:
            base_search_url = f"{self.base_url}/{list_type}-{prop_type}/{city_formatted}"

        all_listings = []

        for page in range(1, max_pages + 1):
            url = f"{base_search_url}?page={page}"
            logger.info(f"Scraping Hürriyet Emlak page {page}: {url}")

            html = await self.fetch_page(url)
            if not html:
                break

            soup = self.parse_html(html)

            # Find all listing cards
            listings = soup.find_all("div", class_=re.compile("listing-card|list-item"))

            if not listings:
                logger.warning(f"No listings found on page {page}")
                break

            for listing in listings:
                try:
                    listing_data = self._parse_listing_card(listing, list_type, prop_type)
                    if listing_data:
                        all_listings.append(listing_data)
                except Exception as e:
                    logger.error(f"Error parsing listing: {str(e)}")
                    continue

            logger.info(f"Scraped {len(listings)} listings from page {page}")

        logger.info(f"Total listings scraped from Hürriyet Emlak: {len(all_listings)}")
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
            id_match = re.search(r"/(\d+)$", url)
            external_id = id_match.group(1) if id_match else None

            if not external_id:
                return None

            # Get title
            title_elem = listing.find(["h3", "h2"], class_=re.compile("title|name"))
            title = title_elem.get_text(strip=True) if title_elem else ""

            # Get price
            price_elem = listing.find(class_=re.compile("price"))
            price = None
            if price_elem:
                price_text = price_elem.get_text(strip=True)
                price = self.clean_price(price_text)

            # Get location
            location_elem = listing.find(class_=re.compile("location|address"))
            location_text = location_elem.get_text(strip=True) if location_elem else ""

            # Parse location
            location_parts = [p.strip() for p in location_text.split(",")]
            district = location_parts[0] if location_parts else ""
            neighborhood = location_parts[1] if len(location_parts) > 1 else ""

            # Get property details
            details = listing.find_all(class_=re.compile("detail|attribute"))
            area_sqm = None
            rooms = None

            for detail in details:
                text = detail.get_text(strip=True)
                if "m²" in text or "m2" in text:
                    area_sqm = self.clean_number(text.replace("m²", "").replace("m2", ""))
                elif "+" in text and len(text) < 5:
                    # Room format like "3+1"
                    parts = text.split("+")
                    rooms = sum(int(p) for p in parts if p.isdigit())

            # Get image
            img_elem = listing.find("img")
            thumbnail_url = None
            if img_elem:
                thumbnail_url = img_elem.get("src") or img_elem.get("data-src")

            return {
                "external_id": f"hurriyetemlak_{external_id}",
                "source": "hurriyetemlak",
                "source_url": url,
                "title": title,
                "price": price,
                "district": district,
                "neighborhood": neighborhood,
                "area_sqm": area_sqm,
                "rooms": rooms,
                "thumbnail_url": thumbnail_url,
                "listing_type": "sale" if listing_type == "satilik" else "rent",
                "property_type": property_type,
            }

        except Exception as e:
            logger.error(f"Error in _parse_listing_card: {str(e)}")
            return None

    async def scrape_detail(self, url: str) -> Optional[Dict[str, Any]]:
        """Scrape detailed information from a Hürriyet Emlak property page"""

        html = await self.fetch_page(url)
        if not html:
            return None

        soup = self.parse_html(html)

        try:
            data = {
                "source": "hurriyetemlak",
                "source_url": url,
            }

            # Extract ID from URL
            id_match = re.search(r"/(\d+)$", url)
            if id_match:
                data["external_id"] = f"hurriyetemlak_{id_match.group(1)}"

            # Get title
            title_elem = soup.find("h1", class_=re.compile("title|name"))
            if title_elem:
                data["title"] = title_elem.get_text(strip=True)

            # Get price
            price_elem = soup.find(class_=re.compile("price-value|detail-price"))
            if price_elem:
                price_text = price_elem.get_text(strip=True)
                data["price"] = self.clean_price(price_text)

            # Get description
            desc_elem = soup.find(class_=re.compile("description|detail-description"))
            if desc_elem:
                data["description"] = desc_elem.get_text(strip=True)

            # Get property attributes
            attributes = soup.find_all(class_=re.compile("property-detail|attribute"))
            features = {}

            for attr in attributes:
                label_elem = attr.find(class_=re.compile("label|key"))
                value_elem = attr.find(class_=re.compile("value|val"))

                if label_elem and value_elem:
                    label = label_elem.get_text(strip=True)
                    value = value_elem.get_text(strip=True)

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
                    elif "Yaş" in label:
                        age_text = value.split()[0]
                        if age_text.isdigit():
                            data["building_age"] = int(age_text)
                    elif "Kat" in label and "Toplam" not in label:
                        floor_match = re.search(r"(\d+)", value)
                        if floor_match:
                            data["floor"] = int(floor_match.group(1))
                    elif "Toplam Kat" in label:
                        data["total_floors"] = self.clean_number(value)
                    elif "Banyo" in label:
                        data["bathrooms"] = self.clean_number(value)
                    elif "Isıtma" in label:
                        data["heating_type"] = value
                    elif "Eşya" in label:
                        data["furnished"] = "Evet" in value or "Yes" in value
                    else:
                        features[label] = value

            data["features"] = features

            # Get location from breadcrumb or address
            breadcrumb = soup.find("nav", class_=re.compile("breadcrumb"))
            if breadcrumb:
                links = breadcrumb.find_all("a")
                if len(links) >= 2:
                    data["city"] = links[-2].get_text(strip=True)
                    data["district"] = links[-1].get_text(strip=True)

            # Get coordinates
            map_elem = soup.find("div", {"data-lat": True, "data-lng": True})
            if map_elem:
                data["latitude"] = float(map_elem.get("data-lat"))
                data["longitude"] = float(map_elem.get("data-lng"))
            else:
                # Try to find in script tags
                script_tags = soup.find_all("script")
                for script in script_tags:
                    if script.string and ("latitude" in script.string or "lat" in script.string):
                        coords = self.extract_coordinates(script.string)
                        if coords:
                            data["latitude"], data["longitude"] = coords
                            break

            # Get images
            images = []
            gallery = soup.find(class_=re.compile("gallery|photos"))
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
            agent_elem = soup.find(class_=re.compile("agent-name|seller-name"))
            if agent_elem:
                data["agent_name"] = agent_elem.get_text(strip=True)

            return data

        except Exception as e:
            logger.error(f"Error scraping Hürriyet Emlak detail page: {str(e)}")
            return None
