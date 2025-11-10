# Emlak - Advanced Turkish Real Estate Aggregator

A modern real estate application that aggregates property listings from major Turkish real estate websites (Sahibinden, Hürriyet Emlak, Emlakjet, etc.) with interactive map-based search.

## Features

🗺️ **Interactive Map Search**
- Draw polygons to select search areas
- Real-time clustering of listings
- Heat map visualization of property prices

🔍 **Multi-Source Aggregation**
- Scrapes data from major Turkish real estate sites
- Unified search across all platforms
- Automatic deduplication of listings

💰 **Price Analytics**
- Price comparison across platforms
- Historical price trends
- Price per square meter analysis
- Market insights and statistics

⚡ **Advanced Features**
- Real-time notifications for new listings
- Saved searches and favorites
- Advanced filtering (price, size, rooms, etc.)
- ML-based price predictions (coming soon)

## Tech Stack

### Backend
- **FastAPI** - High-performance async Python framework
- **PostgreSQL + PostGIS** - Geospatial database
- **Redis** - Caching and session management
- **Celery** - Background task processing
- **Playwright** - Web scraping dynamic content

### Frontend
- **Next.js 14** - React framework with SSR
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS
- **Leaflet** - Interactive maps
- **React Query** - Data fetching and caching

## Project Structure

```
emlak/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core configuration
│   │   ├── models/       # Database models
│   │   ├── scrapers/     # Web scrapers
│   │   ├── services/     # Business logic
│   │   └── tasks/        # Celery tasks
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Next.js pages
│   │   ├── lib/          # Utilities
│   │   └── styles/       # CSS styles
│   ├── public/
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <repo-url>
cd emlak

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Local Development

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create `.env` files in backend and frontend directories:

### Backend `.env`
```env
DATABASE_URL=postgresql://user:password@localhost:5432/emlak
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
CELERY_BROKER_URL=redis://localhost:6379/0
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MAP_CENTER_LAT=41.0082
NEXT_PUBLIC_MAP_CENTER_LNG=28.9784
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Scrapers

Current supported platforms:
- ✅ Sahibinden.com
- ✅ Hürriyet Emlak
- ✅ Emlakjet
- 🔄 Zingat (coming soon)
- 🔄 Benimemlak (coming soon)

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines first.
