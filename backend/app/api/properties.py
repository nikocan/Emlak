from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.services.property_service import PropertyService
from app.schemas.property import (
    PropertyResponse,
    PropertyFilter,
    PropertySearch,
    PropertyStats,
)

router = APIRouter(prefix="/properties", tags=["properties"])


@router.get("/search", response_model=PropertySearch)
def search_properties(
    # Location filters
    city: Optional[str] = Query(None, description="City name"),
    district: Optional[str] = Query(None, description="District name"),
    neighborhood: Optional[str] = Query(None, description="Neighborhood name"),
    # Polygon search (JSON array of [lng, lat] coordinates)
    polygon: Optional[str] = Query(None, description="Polygon coordinates as JSON"),
    # Circle search
    center_lat: Optional[float] = Query(None, ge=-90, le=90),
    center_lng: Optional[float] = Query(None, ge=-180, le=180),
    radius_km: Optional[float] = Query(None, gt=0, le=100),
    # Property filters
    property_type: Optional[str] = Query(None, description="apartment, villa, office, etc."),
    listing_type: Optional[str] = Query(None, description="sale or rent"),
    source: Optional[List[str]] = Query(None, description="Filter by sources"),
    # Price filters
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    # Size filters
    min_area: Optional[float] = Query(None, ge=0),
    max_area: Optional[float] = Query(None, ge=0),
    # Room filters
    min_rooms: Optional[int] = Query(None, ge=0),
    max_rooms: Optional[int] = Query(None, ge=0),
    min_bedrooms: Optional[int] = Query(None, ge=0),
    max_bedrooms: Optional[int] = Query(None, ge=0),
    # Other filters
    furnished: Optional[bool] = None,
    min_floor: Optional[int] = None,
    max_floor: Optional[int] = None,
    # Pagination
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    # Sorting
    sort_by: str = Query("scraped_at", regex="^(price|area_sqm|scraped_at|published_at)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db),
):
    """
    Search properties with various filters

    - **Polygon search**: Provide polygon coordinates as JSON array: [[lng, lat], [lng, lat], ...]
    - **Circle search**: Provide center coordinates and radius in km
    - **Property filters**: Filter by type, listing type, price, size, rooms, etc.
    """

    # Parse polygon if provided
    polygon_coords = None
    if polygon:
        import json

        try:
            polygon_coords = json.loads(polygon)
        except:
            raise HTTPException(status_code=400, detail="Invalid polygon format")

    # Create filter object
    filters = PropertyFilter(
        city=city,
        district=district,
        neighborhood=neighborhood,
        polygon=polygon_coords,
        center_lat=center_lat,
        center_lng=center_lng,
        radius_km=radius_km,
        property_type=property_type,
        listing_type=listing_type,
        source=source,
        min_price=min_price,
        max_price=max_price,
        min_area=min_area,
        max_area=max_area,
        min_rooms=min_rooms,
        max_rooms=max_rooms,
        min_bedrooms=min_bedrooms,
        max_bedrooms=max_bedrooms,
        furnished=furnished,
        min_floor=min_floor,
        max_floor=max_floor,
        skip=skip,
        limit=limit,
        sort_by=sort_by,
        sort_order=sort_order,
    )

    # Search properties
    properties, total, stats = PropertyService.search_properties(db, filters)

    return PropertySearch(
        total=total,
        properties=properties,
        avg_price=stats.get("avg_price"),
        avg_price_per_sqm=stats.get("avg_price_per_sqm"),
        min_price=stats.get("min_price"),
        max_price=stats.get("max_price"),
    )


@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(property_id: int, db: Session = Depends(get_db)):
    """Get a specific property by ID"""

    from app.models.property import Property

    db_property = db.query(Property).filter(Property.id == property_id).first()
    if not db_property:
        raise HTTPException(status_code=404, detail="Property not found")

    return db_property


@router.get("/stats/overview", response_model=PropertyStats)
def get_property_stats(db: Session = Depends(get_db)):
    """Get overall property statistics"""

    return PropertyService.get_property_stats(db)


@router.post("/{property_id}/view")
def increment_view_count(property_id: int, db: Session = Depends(get_db)):
    """Increment view count for a property"""

    from app.models.property import Property

    db_property = db.query(Property).filter(Property.id == property_id).first()
    if not db_property:
        raise HTTPException(status_code=404, detail="Property not found")

    db_property.view_count += 1
    db.commit()

    return {"view_count": db_property.view_count}
