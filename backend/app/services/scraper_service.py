from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.scrapers import SahibindenScraper, HurriyetEmlakScraper, EmlakjetScraper
from app.services.property_service import PropertyService
from app.schemas.property import PropertyCreate
from loguru import logger
import asyncio


class ScraperService:
    """Service for managing web scrapers"""

    def __init__(self):
        self.scrapers = {
            "sahibinden": SahibindenScraper(),
            "hurriyetemlak": HurriyetEmlakScraper(),
            "emlakjet": EmlakjetScraper(),
        }

    async def scrape_all_sources(
        self,
        db: Session,
        city: str,
        district: str = None,
        listing_type: str = "sale",
        property_type: str = "apartment",
        max_pages: int = 3,
    ) -> Dict[str, Any]:
        """
        Scrape all configured sources and save to database

        Args:
            db: Database session
            city: City to scrape
            district: District to scrape (optional)
            listing_type: 'sale' or 'rent'
            property_type: Type of property
            max_pages: Maximum pages per scraper

        Returns:
            Summary of scraping results
        """

        logger.info(
            f"Starting scrape for {city}/{district} - {property_type} {listing_type}"
        )

        results = {
            "total_scraped": 0,
            "total_new": 0,
            "total_updated": 0,
            "by_source": {},
        }

        # Run all scrapers in parallel
        tasks = []
        for source_name, scraper in self.scrapers.items():
            task = self._scrape_source(
                db=db,
                scraper=scraper,
                source_name=source_name,
                city=city,
                district=district,
                listing_type=listing_type,
                property_type=property_type,
                max_pages=max_pages,
            )
            tasks.append(task)

        # Wait for all scrapers to complete
        source_results = await asyncio.gather(*tasks, return_exceptions=True)

        # Aggregate results
        for source_name, source_result in zip(self.scrapers.keys(), source_results):
            if isinstance(source_result, Exception):
                logger.error(f"Error scraping {source_name}: {str(source_result)}")
                results["by_source"][source_name] = {
                    "error": str(source_result),
                    "scraped": 0,
                    "new": 0,
                    "updated": 0,
                }
            else:
                results["total_scraped"] += source_result["scraped"]
                results["total_new"] += source_result["new"]
                results["total_updated"] += source_result["updated"]
                results["by_source"][source_name] = source_result

        logger.info(f"Scraping complete: {results}")
        return results

    async def _scrape_source(
        self,
        db: Session,
        scraper,
        source_name: str,
        city: str,
        district: str,
        listing_type: str,
        property_type: str,
        max_pages: int,
    ) -> Dict[str, int]:
        """Scrape a single source"""

        logger.info(f"Scraping {source_name}...")

        try:
            # Scrape listings
            listings = await scraper.scrape_listings(
                city=city,
                district=district,
                listing_type=listing_type,
                property_type=property_type,
                max_pages=max_pages,
            )

            new_count = 0
            updated_count = 0
            error_count = 0

            # Process each listing
            for listing_data in listings:
                try:
                    # Add city if not present
                    if "city" not in listing_data or not listing_data["city"]:
                        listing_data["city"] = city

                    # Add district if not present
                    if "district" not in listing_data or not listing_data["district"]:
                        listing_data["district"] = district or ""

                    # Ensure required fields
                    listing_data["listing_type"] = listing_type
                    listing_data["property_type"] = property_type

                    # For initial scraping, add default coordinates if not present
                    # In production, you'd want to geocode the address
                    if "latitude" not in listing_data or not listing_data["latitude"]:
                        listing_data["latitude"] = self._get_default_coordinates(city)[0]
                        listing_data["longitude"] = self._get_default_coordinates(city)[1]

                    # Validate required fields
                    if not self._validate_listing(listing_data):
                        logger.warning(f"Invalid listing data: {listing_data.get('external_id')}")
                        error_count += 1
                        continue

                    # Create schema object
                    property_create = PropertyCreate(**listing_data)

                    # Save to database
                    _, is_new = PropertyService.get_or_create_property(db, property_create)

                    if is_new:
                        new_count += 1
                    else:
                        updated_count += 1

                except Exception as e:
                    logger.error(f"Error processing listing: {str(e)}")
                    error_count += 1
                    continue

            logger.info(
                f"{source_name}: scraped={len(listings)}, new={new_count}, "
                f"updated={updated_count}, errors={error_count}"
            )

            return {
                "scraped": len(listings),
                "new": new_count,
                "updated": updated_count,
                "errors": error_count,
            }

        except Exception as e:
            logger.error(f"Error in _scrape_source for {source_name}: {str(e)}")
            raise

    def _validate_listing(self, listing_data: Dict[str, Any]) -> bool:
        """Validate that listing has required fields"""

        required_fields = [
            "external_id",
            "source",
            "title",
            "price",
            "city",
            "district",
            "latitude",
            "longitude",
            "listing_type",
            "property_type",
        ]

        for field in required_fields:
            if field not in listing_data or listing_data[field] is None:
                logger.debug(f"Missing required field: {field}")
                return False

        # Validate price is positive
        if listing_data.get("price", 0) <= 0:
            return False

        # Validate coordinates
        lat = listing_data.get("latitude")
        lng = listing_data.get("longitude")
        if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
            return False

        return True

    def _get_default_coordinates(self, city: str) -> tuple[float, float]:
        """Get default coordinates for a city (fallback)"""

        # Map of major Turkish cities to coordinates
        city_coords = {
            "istanbul": (41.0082, 28.9784),
            "ankara": (39.9334, 32.8597),
            "izmir": (38.4237, 27.1428),
            "antalya": (36.8969, 30.7133),
            "bursa": (40.1826, 29.0665),
            "adana": (37.0000, 35.3213),
            "gaziantep": (37.0662, 37.3833),
            "konya": (37.8667, 32.4833),
            "mersin": (36.8000, 34.6333),
            "kayseri": (38.7205, 35.4826),
        }

        city_lower = city.lower()
        return city_coords.get(city_lower, (39.9334, 32.8597))  # Default to Ankara

    async def scrape_property_details(
        self, db: Session, property_id: int
    ) -> Dict[str, Any]:
        """Scrape detailed information for a specific property"""

        from app.models.property import Property

        # Get property from database
        db_property = db.query(Property).filter(Property.id == property_id).first()
        if not db_property:
            raise ValueError(f"Property {property_id} not found")

        # Get appropriate scraper
        scraper = self.scrapers.get(db_property.source)
        if not scraper:
            raise ValueError(f"No scraper for source: {db_property.source}")

        # Scrape details
        logger.info(f"Scraping details for property {property_id} from {db_property.source}")
        details = await scraper.scrape_detail(db_property.source_url)

        if details:
            # Update property with detailed info
            for key, value in details.items():
                if value is not None and hasattr(db_property, key):
                    setattr(db_property, key, value)

            db.commit()
            db.refresh(db_property)

            logger.info(f"Updated property {property_id} with detailed info")

        return details
