from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Boolean
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from app.core.database import Base


class SavedSearch(Base):
    """Saved search queries with notifications"""

    __tablename__ = "saved_searches"

    id = Column(Integer, primary_key=True, index=True)

    # User info (simplified - can be extended with user authentication)
    user_email = Column(String(255), nullable=False, index=True)

    # Search parameters
    name = Column(String(200), nullable=False)
    search_area = Column(Geometry("POLYGON", srid=4326))  # Geographic boundary

    # Filters
    property_type = Column(String(50))
    listing_type = Column(String(20))
    min_price = Column(Float)
    max_price = Column(Float)
    min_area = Column(Float)
    max_area = Column(Float)
    min_rooms = Column(Integer)
    max_rooms = Column(Integer)
    city = Column(String(100))
    district = Column(String(100))

    # Additional filters
    filters = Column(JSON)  # Additional flexible filters

    # Notification settings
    notify_email = Column(Boolean, default=True)
    notify_frequency = Column(String(20), default="daily")  # immediate, daily, weekly

    # Metadata
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_notified_at = Column(DateTime(timezone=True))

    def __repr__(self):
        return f"<SavedSearch {self.id}: {self.name}>"
