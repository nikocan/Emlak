from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime


class PropertyBase(BaseModel):
    """Base property schema"""

    title: str
    description: Optional[str] = None
    property_type: str
    listing_type: str

    # Location
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    address: Optional[str] = None
    city: str
    district: str
    neighborhood: Optional[str] = None

    # Price
    price: float = Field(..., gt=0)
    currency: str = "TRY"

    # Details
    area_sqm: Optional[float] = Field(None, gt=0)
    rooms: Optional[int] = Field(None, ge=0)
    bedrooms: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[int] = Field(None, ge=0)
    floor: Optional[int] = None
    total_floors: Optional[int] = Field(None, ge=0)
    building_age: Optional[int] = Field(None, ge=0)

    # Features
    features: Optional[Dict[str, Any]] = None
    heating_type: Optional[str] = None
    furnished: bool = False

    # Images
    images: Optional[List[str]] = None
    thumbnail_url: Optional[str] = None


class PropertyCreate(PropertyBase):
    """Schema for creating a property"""

    external_id: str
    source: str
    source_url: str
    agent_name: Optional[str] = None
    agent_phone: Optional[str] = None
    agency_name: Optional[str] = None
    published_at: Optional[datetime] = None


class PropertyResponse(PropertyBase):
    """Schema for property response"""

    id: int
    external_id: str
    source: str
    source_url: str
    price_per_sqm: Optional[float] = None
    agent_name: Optional[str] = None
    agent_phone: Optional[str] = None
    agency_name: Optional[str] = None
    is_active: bool
    view_count: int
    scraped_at: datetime
    updated_at: Optional[datetime] = None
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PropertyFilter(BaseModel):
    """Schema for filtering properties"""

    # Location filters
    city: Optional[str] = None
    district: Optional[str] = None
    neighborhood: Optional[str] = None

    # Polygon search (array of [lng, lat] coordinates)
    polygon: Optional[List[List[float]]] = None

    # Circle search (center point + radius in km)
    center_lat: Optional[float] = Field(None, ge=-90, le=90)
    center_lng: Optional[float] = Field(None, ge=-180, le=180)
    radius_km: Optional[float] = Field(None, gt=0, le=100)

    # Property filters
    property_type: Optional[str] = None
    listing_type: Optional[str] = None
    source: Optional[List[str]] = None

    # Price filters
    min_price: Optional[float] = Field(None, ge=0)
    max_price: Optional[float] = Field(None, ge=0)

    # Size filters
    min_area: Optional[float] = Field(None, ge=0)
    max_area: Optional[float] = Field(None, ge=0)

    # Room filters
    min_rooms: Optional[int] = Field(None, ge=0)
    max_rooms: Optional[int] = Field(None, ge=0)
    min_bedrooms: Optional[int] = Field(None, ge=0)
    max_bedrooms: Optional[int] = Field(None, ge=0)

    # Other filters
    furnished: Optional[bool] = None
    min_floor: Optional[int] = None
    max_floor: Optional[int] = None

    # Pagination
    skip: int = Field(0, ge=0)
    limit: int = Field(100, ge=1, le=1000)

    # Sorting
    sort_by: str = Field("scraped_at", pattern="^(price|area_sqm|scraped_at|published_at)$")
    sort_order: str = Field("desc", pattern="^(asc|desc)$")


class PropertySearch(BaseModel):
    """Schema for property search response"""

    total: int
    properties: List[PropertyResponse]
    avg_price: Optional[float] = None
    avg_price_per_sqm: Optional[float] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None


class PropertyStats(BaseModel):
    """Schema for property statistics"""

    total_properties: int
    by_source: Dict[str, int]
    by_property_type: Dict[str, int]
    by_city: Dict[str, int]
    avg_price: float
    avg_price_per_sqm: Optional[float] = None
    price_range: Dict[str, float]
