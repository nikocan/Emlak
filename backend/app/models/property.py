from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, JSON, Index
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from app.core.database import Base


class Property(Base):
    """Property listing model with geospatial support"""

    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)

    # External IDs
    external_id = Column(String(255), unique=True, index=True, nullable=False)
    source = Column(String(50), nullable=False, index=True)  # sahibinden, hurriyetemlak, etc.
    source_url = Column(String(500), nullable=False)

    # Basic Info
    title = Column(String(500), nullable=False)
    description = Column(Text)
    property_type = Column(String(50), nullable=False, index=True)  # apartment, villa, office, etc.
    listing_type = Column(String(20), nullable=False, index=True)  # sale, rent

    # Location
    location = Column(Geometry("POINT", srid=4326), nullable=False)  # PostGIS geometry
    address = Column(String(500))
    city = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=False, index=True)
    neighborhood = Column(String(100), index=True)
    zip_code = Column(String(10))

    # Price
    price = Column(Float, nullable=False, index=True)
    currency = Column(String(3), default="TRY")
    price_per_sqm = Column(Float)

    # Property Details
    area_sqm = Column(Float)
    rooms = Column(Integer)
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    floor = Column(Integer)
    total_floors = Column(Integer)
    building_age = Column(Integer)

    # Features
    features = Column(JSON)  # parking, elevator, balcony, etc.
    heating_type = Column(String(50))
    furnished = Column(Boolean, default=False)

    # Images
    images = Column(JSON)  # Array of image URLs
    thumbnail_url = Column(String(500))

    # Agent/Owner
    agent_name = Column(String(200))
    agent_phone = Column(String(20))
    agency_name = Column(String(200))

    # Metadata
    is_active = Column(Boolean, default=True, index=True)
    view_count = Column(Integer, default=0)
    scraped_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True))

    # Indexes for geospatial queries
    __table_args__ = (
        Index("idx_location_gist", "location", postgresql_using="gist"),
        Index("idx_price_area", "price", "area_sqm"),
        Index("idx_city_district", "city", "district"),
        Index("idx_source_active", "source", "is_active"),
    )

    def __repr__(self):
        return f"<Property {self.id}: {self.title[:50]}>"

    @property
    def latitude(self) -> float:
        """Get latitude from geometry"""
        if self.location:
            from geoalchemy2.shape import to_shape
            point = to_shape(self.location)
            return point.y
        return None

    @property
    def longitude(self) -> float:
        """Get longitude from geometry"""
        if self.location:
            from geoalchemy2.shape import to_shape
            point = to_shape(self.location)
            return point.x
        return None
