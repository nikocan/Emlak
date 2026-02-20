from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.services.scraper_service import ScraperService
from pydantic import BaseModel

router = APIRouter(prefix="/scraper", tags=["scraper"])


class ScrapeRequest(BaseModel):
    """Request model for scraping"""

    city: str
    district: Optional[str] = None
    listing_type: str = "sale"
    property_type: str = "apartment"
    max_pages: int = 3


class ScrapeResponse(BaseModel):
    """Response model for scraping"""

    status: str
    message: str


@router.post("/scrape", response_model=ScrapeResponse)
async def scrape_properties(
    request: ScrapeRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Trigger scraping for a specific location and property type

    This endpoint will scrape all configured sources (Sahibinden, Hürriyet Emlak, Emlakjet)
    for the specified city, district, and property type.

    **Note**: Scraping is performed in the background to avoid timeout issues.
    """

    scraper_service = ScraperService()

    # Run scraping in background
    background_tasks.add_task(
        scraper_service.scrape_all_sources,
        db=db,
        city=request.city,
        district=request.district,
        listing_type=request.listing_type,
        property_type=request.property_type,
        max_pages=request.max_pages,
    )

    return ScrapeResponse(
        status="started",
        message=f"Scraping started for {request.city}/{request.district or 'all'} - "
        f"{request.property_type} {request.listing_type}",
    )


@router.post("/scrape/sync")
async def scrape_properties_sync(
    request: ScrapeRequest,
    db: Session = Depends(get_db),
):
    """
    Scrape properties synchronously (wait for completion)

    **Warning**: This may take a long time depending on max_pages.
    Use /scrape endpoint for background processing.
    """

    scraper_service = ScraperService()

    results = await scraper_service.scrape_all_sources(
        db=db,
        city=request.city,
        district=request.district,
        listing_type=request.listing_type,
        property_type=request.property_type,
        max_pages=request.max_pages,
    )

    return {
        "status": "completed",
        "results": results,
    }


@router.post("/scrape/detail/{property_id}")
async def scrape_property_detail(
    property_id: int,
    db: Session = Depends(get_db),
):
    """
    Scrape detailed information for a specific property

    This will fetch the full property details from the source website
    and update the database record.
    """

    scraper_service = ScraperService()

    try:
        details = await scraper_service.scrape_property_details(db, property_id)

        return {
            "status": "success",
            "property_id": property_id,
            "details": details,
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")
