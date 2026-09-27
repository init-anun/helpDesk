from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from contextlib import asynccontextmanager

from core.seed import seed_roles_and_users
from db.database import create_tables

from routers import (
    auth, 
    patient, 
    therapist,
    schedule,
    billing,
)

# Import models so SQLAlchemy registers them
from models import (
    Role, 
    User, 
    Patient, 
    Therapist,
    Schedule,
    MasterTransaction,
    VoucherDetail,
    VoucherSubDetail,
)



@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    # Base.metadata.create_all(bind=engine)   # create tables
    create_tables()
    
    seed_roles_and_users()                  # seed roles + admin
    yield
    # Shutdown (optional)
 
# from routers import router

app = FastAPI(
    title="helpdesk",
    description="A simple helpdesk API built with FastAPI",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(patient.router, prefix=settings.API_PREFIX)
app.include_router(therapist.router, prefix=settings.API_PREFIX)
app.include_router(schedule.router, prefix=settings.API_PREFIX)
app.include_router(billing.router, prefix=settings.API_PREFIX)

# app.include_router(explanation.router, prefix=settings.API_PREFIX)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
    