from typing import List, Dict, Any, Optional
from .base import BaseScraper
from loguru import logger
import re
import json


class SahibindenScraper(BaseScraper):
    """Scraper for sahibinden.com"""

    def __init__(self):
        super().__init__()
        self.base_url = "https://www.sahibinden.com"
        self.source_name = "sahibinden"

    async def scrape_listings(
        self,
        city: str,
        district: Optional[str] = None,
        listing_type: str = "sale",
        property_type: str = "apartment",
        max_pages: int = 5,
    ) -> List[Dict[str, Any]]:
        """Scrape property listings from Sahibinden"""

        # Map property types to Sahibinden categories
        property_map = {
            "apartment": "konut/satilik-daire",
            "villa": "konut/satilik-villa",
            "office": "isyeri/satilik-ofis",
            "land": "arsa",
        }

        if listing_type == "rent":
            property_map = {
                "apartment": "konut/kiralik-daire",
                "villa": "konut/kiralik-villa",
                "office": "isyeri/kiralik-ofis",
            }

        category = property_map.get(property_type, "konut/satilik-daire")

        # Build URL
        city_formatted = city.lower().replace(" ", "-")
        if district:
            district_formatted = district.lower().replace(" ", "-")
            base_search_url = f"{self.base_url}/{category}/{city_formatted}/{district_formatted}"
        else:
            base_search_url = f"{self.base_url}/{category}/{city_formatted}"

        all_listings = []

        for page in range(1, max_pages + 1):
            url = f"{base_search_url}?pagingOffset={page}"
            logger.info(f"Scraping Sahibinden page {page}: {url}")

            html = await self.fetch_page(url)
            if not html:
                break

            soup = self.parse_html(html)

            # Find all listing items
            listings = soup.find_all("tr", class_="searchResultsItem")

            if not listings:
                logger.warning(f"No listings found on page {page}")
                break

            for listing in listings:
                try:
                    listing_data = self._parse_listing_card(listing)
                    if listing_data:
                        all_listings.append(listing_data)
                except Exception as e:
                    logger.error(f"Error parsing listing: {str(e)}")
                    continue

            logger.info(f"Scraped {len(listings)} listings from page {page}")

        logger.info(f"Total listings scraped from Sahibinden: {len(all_listings)}")
        return all_listings

    def _parse_listing_card(self, listing) -> Optional[Dict[str, Any]]:
        """Parse a single listing card from search results"""

        try:
            # Get listing ID and URL
            title_link = listing.find("a", class_="classifiedTitle")
            if not title_link:
                return None

            external_id = listing.get("data-id")
            if not external_id:
                return None

            url = self.base_url + title_link.get("href")
            title = title_link.get_text(strip=True)

            # Get price
            price_elem = listing.find("td", class_="searchResultsPriceValue")
            price = None
            if price_elem:
                price_text = price_elem.get_text(strip=True)
                price = self.clean_price(price_text)

            # Get location
            location_elem = listing.find("td", class_="searchResultsLocationValue")
            location_text = ""
            if location_elem:
                location_text = location_elem.get_text(strip=True)

            # Parse location (usually: "District, Neighborhood")
            location_parts = [p.strip() for p in location_text.split(",")]
            district = location_parts[0] if location_parts else ""
            neighborhood = location_parts[1] if len(location_parts) > 1 else ""

            # Get property details
            attributes = listing.find_all("td", class_="searchResultsAttributeValue")
            area_sqm = None
            rooms = None

            if len(attributes) >= 2:
                # Usually: rooms, area
                rooms_text = attributes[0].get_text(strip=True)
                area_text = attributes[1].get_text(strip=True)

                # Parse rooms (e.g., "3+1" -> 4)
                if "+" in rooms_text:
                    parts = rooms_text.split("+")
                    rooms = sum(int(p) for p in parts if p.isdigit())
                elif rooms_text.isdigit():
                    rooms = int(rooms_text)

                # Parse area
                area_sqm = self.clean_number(area_text.replace("m²", ""))

            # Get image
            img_elem = listing.find("img", class_="searchResultsLargeThumbnail")
            thumbnail_url = img_elem.get("src") if img_elem else None

            # Get date
            date_elem = listing.find("td", class_="searchResultsDateValue")
            published_text = date_elem.get_text(strip=True) if date_elem else ""

            return {
                "external_id": f"sahibinden_{external_id}",
                "source": "sahibinden",
                "source_url": url,
                "title": title,
                "price": price,
                "district": district,
                "neighborhood": neighborhood,
                "area_sqm": area_sqm,
                "rooms": rooms,
                "thumbnail_url": thumbnail_url,
                "listing_type": "sale",  # Will be updated based on search
                "property_type": "apartment",  # Will be updated based on search
            }

        except Exception as e:
            logger.error(f"Error in _parse_listing_card: {str(e)}")
            return None

    async def scrape_detail(self, url: str) -> Optional[Dict[str, Any]]:
        """Scrape detailed information from a Sahibinden property page"""

        html = await self.fetch_page(url)
        if not html:
            return None

        soup = self.parse_html(html)

        try:
            # Extract property data from the page
            data = {
                "source": "sahibinden",
                "source_url": url,
            }

            # Get title
            title_elem = soup.find("h1", class_="classifiedDetailTitle")
            if title_elem:
                data["title"] = title_elem.get_text(strip=True)

            # Get price
            price_elem = soup.find("div", class_="classifiedInfoPrice")
            if price_elem:
                price_text = price_elem.get_text(strip=True)
                data["price"] = self.clean_price(price_text)

            # Get description
            desc_elem = soup.find("div", id="classifiedDescription")
            if desc_elem:
                data["description"] = desc_elem.get_text(strip=True)

            # Get property attributes
            attributes = soup.find_all("li", class_="classifiedInfo")
            features = {}

            for attr in attributes:
                label_elem = attr.find("strong")
                value_elem = attr.find("span")

                if label_elem and value_elem:
                    label = label_elem.get_text(strip=True).replace(":", "")
                    value = value_elem.get_text(strip=True)

                    # Map common attributes
                    if "İlan No" in label:
                        data["external_id"] = f"sahibinden_{value}"
                    elif "m²" in label or "Alan" in label:
                        data["area_sqm"] = self.clean_number(value.replace("m²", ""))
                    elif "Oda Sayısı" in label:
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
                    elif "Kat" in label and "Kat Sayısı" not in label:
                        # Extract floor (e.g., "3" from "3. Kat")
                        floor_match = re.search(r"(\d+)", value)
                        if floor_match:
                            data["floor"] = int(floor_match.group(1))
                    elif "Kat Sayısı" in label:
                        data["total_floors"] = self.clean_number(value)
                    elif "Banyo Sayısı" in label:
                        data["bathrooms"] = self.clean_number(value)
                    elif "Isıtma" in label:
                        data["heating_type"] = value
                    elif "Eşyalı" in label or "Mobilya" in label:
                        data["furnished"] = "Evet" in value or "Yes" in value
                    else:
                        features[label] = value

            data["features"] = features

            # Get location
            location_elem = soup.find("div", class_="classifiedInfoList")
            if location_elem:
                breadcrumb = location_elem.find_all("a")
                if len(breadcrumb) >= 2:
                    data["city"] = breadcrumb[0].get_text(strip=True)
                    data["district"] = breadcrumb[1].get_text(strip=True)
                if len(breadcrumb) >= 3:
                    data["neighborhood"] = breadcrumb[2].get_text(strip=True)

            # Get coordinates from map
            map_script = soup.find("script", string=re.compile("mapData"))
            if map_script:
                coords = self.extract_coordinates(map_script.string)
                if coords:
                    data["latitude"], data["longitude"] = coords

            # Get images
            images = []
            image_elements = soup.find_all("img", {"data-src": True})
            for img in image_elements:
                img_url = img.get("data-src")
                if img_url and "cdn.sahibinden.com" in img_url:
                    images.append(img_url)

            if images:
                data["images"] = images
                data["thumbnail_url"] = images[0]

            # Get agent info
            seller_elem = soup.find("div", class_="classifiedInfoUsername")
            if seller_elem:
                data["agent_name"] = seller_elem.get_text(strip=True)

            phone_elem = soup.find("button", class_="btn-phone")
            if phone_elem:
                data["agent_phone"] = phone_elem.get("data-phone", "")

            return data

        except Exception as e:
            logger.error(f"Error scraping Sahibinden detail page: {str(e)}")
            return None
