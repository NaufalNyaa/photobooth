from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64
import shutil


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory if it doesn't exist
UPLOAD_DIR = ROOT_DIR / 'uploads'
UPLOAD_DIR.mkdir(exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ============= EXISTING MODELS =============
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# ============= NEW MODELS FOR PHOTO BOOTH =============
class PhotoMetadata(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    filename: str
    layout_count: int
    filter_applied: str
    frame_applied: str
    has_stickers: bool
    stickers_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    file_size: Optional[int] = None

class PhotoCreate(BaseModel):
    title: str
    image_data: str  # base64 encoded image
    layout_count: int
    filter_applied: str
    frame_applied: str
    has_stickers: bool
    stickers_count: int = 0

class PhotoUpdate(BaseModel):
    title: Optional[str] = None


# ============= EXISTING ROUTES =============
@api_router.get("/")
async def root():
    return {"message": "Hallo Dunia Tipu-tipu"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)

    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()

    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)

    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])

    return status_checks


# ============= NEW PHOTO BOOTH ROUTES =============

@api_router.post("/photos", response_model=PhotoMetadata)
async def create_photo(photo_data: PhotoCreate):
    """
    Upload a new photo strip with metadata
    """
    try:
        # Generate unique filename
        photo_id = str(uuid.uuid4())
        filename = f"{photo_id}.png"
        file_path = UPLOAD_DIR / filename

        # Decode base64 image and save
        try:
            # Remove data URL prefix if present
            if ',' in photo_data.image_data:
                image_data = photo_data.image_data.split(',')[1]
            else:
                image_data = photo_data.image_data

            image_bytes = base64.b64decode(image_data)

            with open(file_path, 'wb') as f:
                f.write(image_bytes)

            file_size = len(image_bytes)

        except Exception as e:
            logger.error(f"Failed to decode/save image: {str(e)}")
            raise HTTPException(status_code=400, detail="Invalid image data")

        # Create metadata object
        metadata = PhotoMetadata(
            id=photo_id,
            title=photo_data.title,
            filename=filename,
            layout_count=photo_data.layout_count,
            filter_applied=photo_data.filter_applied,
            frame_applied=photo_data.frame_applied,
            has_stickers=photo_data.has_stickers,
            stickers_count=photo_data.stickers_count,
            file_size=file_size
        )

        # Save to MongoDB
        doc = metadata.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()

        await db.photos.insert_one(doc)

        logger.info(f"Photo saved: {photo_id} - {photo_data.title}")
        return metadata

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating photo: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/photos", response_model=List[PhotoMetadata])
async def get_photos(limit: int = 100, skip: int = 0):
    """
    Get all photos with metadata (newest first)
    """
    try:
        photos = await db.photos.find(
            {},
            {"_id": 0}
        ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)

        # Convert ISO string timestamps back to datetime objects
        for photo in photos:
            if isinstance(photo['created_at'], str):
                photo['created_at'] = datetime.fromisoformat(photo['created_at'])

        return photos

    except Exception as e:
        logger.error(f"Error fetching photos: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/photos/{photo_id}", response_model=PhotoMetadata)
async def get_photo(photo_id: str):
    """
    Get a specific photo's metadata
    """
    try:
        photo = await db.photos.find_one({"id": photo_id}, {"_id": 0})

        if not photo:
            raise HTTPException(status_code=404, detail="Photo not found")

        if isinstance(photo['created_at'], str):
            photo['created_at'] = datetime.fromisoformat(photo['created_at'])

        return photo

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching photo: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/photos/{photo_id}/image")
async def get_photo_image(photo_id: str):
    """
    Get the actual image file
    """
    try:
        # Get metadata from MongoDB
        photo = await db.photos.find_one({"id": photo_id}, {"_id": 0})

        if not photo:
            raise HTTPException(status_code=404, detail="Photo not found")

        file_path = UPLOAD_DIR / photo['filename']

        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Image file not found")

        return FileResponse(
            file_path,
            media_type="image/png",
            filename=photo['filename']
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching photo image: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.put("/photos/{photo_id}", response_model=PhotoMetadata)
async def update_photo(photo_id: str, update_data: PhotoUpdate):
    """
    Update photo metadata (e.g., title)
    """
    try:
        photo = await db.photos.find_one({"id": photo_id})

        if not photo:
            raise HTTPException(status_code=404, detail="Photo not found")

        # Update only provided fields
        update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}

        if update_dict:
            await db.photos.update_one(
                {"id": photo_id},
                {"$set": update_dict}
            )

        # Fetch updated photo
        updated_photo = await db.photos.find_one({"id": photo_id}, {"_id": 0})

        if isinstance(updated_photo['created_at'], str):
            updated_photo['created_at'] = datetime.fromisoformat(updated_photo['created_at'])

        return updated_photo

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating photo: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.delete("/photos/{photo_id}")
async def delete_photo(photo_id: str):
    """
    Delete a photo and its metadata
    """
    try:
        photo = await db.photos.find_one({"id": photo_id})

        if not photo:
            raise HTTPException(status_code=404, detail="Photo not found")

        # Delete file
        file_path = UPLOAD_DIR / photo['filename']
        if file_path.exists():
            file_path.unlink()

        # Delete from MongoDB
        await db.photos.delete_one({"id": photo_id})

        logger.info(f"Photo deleted: {photo_id}")
        return {"message": "Photo deleted successfully", "id": photo_id}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting photo: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
