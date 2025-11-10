from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime


class SavedSearchBase(BaseModel):
    """Base saved search schema"""

    name: str
    user_email: EmailStr

    # Search area (polygon coordinates)
    polygon: Optional[List[List[float]]] = None

    # Filters
    property_type: Optional[str] = None
    listing_type: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_area: Optional[float] = None
    max_area: Optional[float] = None
    min_rooms: Optional[int] = None
    max_rooms: Optional[int] = None
    city: Optional[str] = None
    district: Optional[str] = None
    filters: Optional[Dict[str, Any]] = None

    # Notification settings
    notify_email: bool = True
    notify_frequency: str = "daily"


class SavedSearchCreate(SavedSearchBase):
    """Schema for creating a saved search"""
    pass


class SavedSearchResponse(SavedSearchBase):
    """Schema for saved search response"""

    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_notified_at: Optional[datetime] = None

    class Config:
        from_attributes = True
