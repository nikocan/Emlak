from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from geoalchemy2.functions import ST_DWithin, ST_MakePoint, ST_Distance, ST_Contains, ST_GeomFromText
from geoalchemy2.shape import from_shape
from shapely.geometry import Point, Polygon
from app.models.property import Property
from app.schemas.property import PropertyCreate, PropertyFilter, PropertyStats
from loguru import logger


class PropertyService:
    """Service for property-related operations"""

    @staticmethod
    def create_property(db: Session, property_data: PropertyCreate) -> Property:
        """Create a new property listing"""

        # Create PostGIS point from lat/lng
        point = from_shape(Point(property_data.longitude, property_data.latitude), srid=4326)

        # Calculate price per sqm
        price_per_sqm = None
        if property_data.area_sqm and property_data.area_sqm > 0:
            price_per_sqm = property_data.price / property_data.area_sqm

        # Create property object
        db_property = Property(
            external_id=property_data.external_id,
            source=property_data.source,
            source_url=property_data.source_url,
            title=property_data.title,
            description=property_data.description,
            property_type=property_data.property_type,
            listing_type=property_data.listing_type,
            location=point,
            address=property_data.address,
            city=property_data.city,
            district=property_data.district,
            neighborhood=property_data.neighborhood,
            price=property_data.price,
            currency=property_data.currency,
            price_per_sqm=price_per_sqm,
            area_sqm=property_data.area_sqm,
            rooms=property_data.rooms,
            bedrooms=property_data.bedrooms,
            bathrooms=property_data.bathrooms,
            floor=property_data.floor,
            total_floors=property_data.total_floors,
            building_age=property_data.building_age,
            features=property_data.features,
            heating_type=property_data.heating_type,
            furnished=property_data.furnished,
            images=property_data.images,
            thumbnail_url=property_data.thumbnail_url,
            agent_name=property_data.agent_name,
            agent_phone=property_data.agent_phone,
            agency_name=property_data.agency_name,
            published_at=property_data.published_at,
        )

        db.add(db_property)
        db.commit()
        db.refresh(db_property)

        return db_property

    @staticmethod
    def get_or_create_property(db: Session, property_data: PropertyCreate) -> Tuple[Property, bool]:
        """Get existing property or create new one"""

        existing = db.query(Property).filter(
            Property.external_id == property_data.external_id
        ).first()

        if existing:
            # Update existing property
            PropertyService.update_property(db, existing.id, property_data)
            return existing, False
        else:
            # Create new property
            new_property = PropertyService.create_property(db, property_data)
            return new_property, True

    @staticmethod
    def update_property(db: Session, property_id: int, property_data: PropertyCreate) -> Property:
        """Update an existing property"""

        db_property = db.query(Property).filter(Property.id == property_id).first()
        if not db_property:
            return None

        # Update fields
        for field, value in property_data.model_dump(exclude_unset=True).items():
            if field in ["latitude", "longitude"]:
                continue  # Handle separately
            setattr(db_property, field, value)

        # Update location if coordinates provided
        if property_data.latitude and property_data.longitude:
            point = from_shape(Point(property_data.longitude, property_data.latitude), srid=4326)
            db_property.location = point

        # Recalculate price per sqm
        if db_property.area_sqm and db_property.area_sqm > 0:
            db_property.price_per_sqm = db_property.price / db_property.area_sqm

        db.commit()
        db.refresh(db_property)

        return db_property

    @staticmethod
    def search_properties(
        db: Session, filters: PropertyFilter
    ) -> Tuple[List[Property], int, dict]:
        """
        Search properties with filters and geospatial queries

        Returns:
            Tuple of (properties, total_count, statistics)
        """

        query = db.query(Property).filter(Property.is_active == True)

        # Location filters
        if filters.city:
            query = query.filter(Property.city.ilike(f"%{filters.city}%"))

        if filters.district:
            query = query.filter(Property.district.ilike(f"%{filters.district}%"))

        if filters.neighborhood:
            query = query.filter(Property.neighborhood.ilike(f"%{filters.neighborhood}%"))

        # Polygon search (area selection on map)
        if filters.polygon and len(filters.polygon) >= 3:
            # Convert polygon coordinates to PostGIS polygon
            polygon_wkt = PropertyService._create_polygon_wkt(filters.polygon)
            query = query.filter(
                ST_Contains(
                    ST_GeomFromText(polygon_wkt, 4326),
                    Property.location
                )
            )

        # Radius search (circle around a point)
        if filters.center_lat and filters.center_lng and filters.radius_km:
            center_point = ST_MakePoint(filters.center_lng, filters.center_lat)
            radius_meters = filters.radius_km * 1000

            query = query.filter(
                ST_DWithin(
                    Property.location,
                    center_point,
                    radius_meters,
                    use_spheroid=True
                )
            )

        # Property type filters
        if filters.property_type:
            query = query.filter(Property.property_type == filters.property_type)

        if filters.listing_type:
            query = query.filter(Property.listing_type == filters.listing_type)

        if filters.source:
            query = query.filter(Property.source.in_(filters.source))

        # Price filters
        if filters.min_price is not None:
            query = query.filter(Property.price >= filters.min_price)

        if filters.max_price is not None:
            query = query.filter(Property.price <= filters.max_price)

        # Size filters
        if filters.min_area is not None:
            query = query.filter(Property.area_sqm >= filters.min_area)

        if filters.max_area is not None:
            query = query.filter(Property.area_sqm <= filters.max_area)

        # Room filters
        if filters.min_rooms is not None:
            query = query.filter(Property.rooms >= filters.min_rooms)

        if filters.max_rooms is not None:
            query = query.filter(Property.rooms <= filters.max_rooms)

        if filters.min_bedrooms is not None:
            query = query.filter(Property.bedrooms >= filters.min_bedrooms)

        if filters.max_bedrooms is not None:
            query = query.filter(Property.bedrooms <= filters.max_bedrooms)

        # Other filters
        if filters.furnished is not None:
            query = query.filter(Property.furnished == filters.furnished)

        if filters.min_floor is not None:
            query = query.filter(Property.floor >= filters.min_floor)

        if filters.max_floor is not None:
            query = query.filter(Property.floor <= filters.max_floor)

        # Get total count before pagination
        total_count = query.count()

        # Calculate statistics
        stats = {}
        if total_count > 0:
            stats_query = query.with_entities(
                func.avg(Property.price).label("avg_price"),
                func.avg(Property.price_per_sqm).label("avg_price_per_sqm"),
                func.min(Property.price).label("min_price"),
                func.max(Property.price).label("max_price"),
            ).first()

            stats = {
                "avg_price": float(stats_query.avg_price) if stats_query.avg_price else 0,
                "avg_price_per_sqm": (
                    float(stats_query.avg_price_per_sqm) if stats_query.avg_price_per_sqm else 0
                ),
                "min_price": float(stats_query.min_price) if stats_query.min_price else 0,
                "max_price": float(stats_query.max_price) if stats_query.max_price else 0,
            }

        # Sorting
        if filters.sort_by == "price":
            sort_column = Property.price
        elif filters.sort_by == "area_sqm":
            sort_column = Property.area_sqm
        elif filters.sort_by == "published_at":
            sort_column = Property.published_at
        else:
            sort_column = Property.scraped_at

        if filters.sort_order == "asc":
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        # Pagination
        properties = query.offset(filters.skip).limit(filters.limit).all()

        return properties, total_count, stats

    @staticmethod
    def get_property_stats(db: Session) -> PropertyStats:
        """Get overall property statistics"""

        total = db.query(Property).filter(Property.is_active == True).count()

        # By source
        by_source = dict(
            db.query(Property.source, func.count(Property.id))
            .filter(Property.is_active == True)
            .group_by(Property.source)
            .all()
        )

        # By property type
        by_property_type = dict(
            db.query(Property.property_type, func.count(Property.id))
            .filter(Property.is_active == True)
            .group_by(Property.property_type)
            .all()
        )

        # By city
        by_city = dict(
            db.query(Property.city, func.count(Property.id))
            .filter(Property.is_active == True)
            .group_by(Property.city)
            .order_by(func.count(Property.id).desc())
            .limit(10)
            .all()
        )

        # Price statistics
        price_stats = (
            db.query(
                func.avg(Property.price).label("avg_price"),
                func.avg(Property.price_per_sqm).label("avg_price_per_sqm"),
                func.min(Property.price).label("min_price"),
                func.max(Property.price).label("max_price"),
            )
            .filter(Property.is_active == True)
            .first()
        )

        return PropertyStats(
            total_properties=total,
            by_source=by_source,
            by_property_type=by_property_type,
            by_city=by_city,
            avg_price=float(price_stats.avg_price) if price_stats.avg_price else 0,
            avg_price_per_sqm=(
                float(price_stats.avg_price_per_sqm) if price_stats.avg_price_per_sqm else None
            ),
            price_range={
                "min": float(price_stats.min_price) if price_stats.min_price else 0,
                "max": float(price_stats.max_price) if price_stats.max_price else 0,
            },
        )

    @staticmethod
    def _create_polygon_wkt(coordinates: List[List[float]]) -> str:
        """
        Create WKT (Well-Known Text) polygon from coordinates

        Args:
            coordinates: List of [lng, lat] pairs

        Returns:
            WKT polygon string
        """
        # Ensure polygon is closed
        if coordinates[0] != coordinates[-1]:
            coordinates.append(coordinates[0])

        # Format as WKT: POLYGON((lng lat, lng lat, ...))
        points = ", ".join([f"{lng} {lat}" for lng, lat in coordinates])
        return f"POLYGON(({points}))"

    @staticmethod
    def delete_property(db: Session, property_id: int) -> bool:
        """Soft delete a property (mark as inactive)"""

        db_property = db.query(Property).filter(Property.id == property_id).first()
        if not db_property:
            return False

        db_property.is_active = False
        db.commit()

        return True
