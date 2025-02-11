# external
from fastapi import FastAPI, APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from neo4j import GraphDatabase
from twilio.rest import Client
from fastapi.middleware.cors import CORSMiddleware

# internal 
from backend.app.services.auth import create_access_token, get_current_user
from backend.app.core.config import settings
from backend.app.routes.users import user_router
from backend.app.routes.auth import auth_router
from backend.app.schemas.users import UserInDb

async def lifespan(app: FastAPI):
    """Controls the lifespan of the app from startup to shutdown and properly manages the neccessary resources"""
    # neo4j
    driver = GraphDatabase.driver(settings.NEO4J_URI, auth=(settings.NEO4J_USERNAME, settings.NEO4J_PASSWORD))
    session = driver.session(database="neo4j")
    app.state.neo4j_driver = driver
    app.state.neo4j_session = session

    # twilio
    twilio_client = Client(settings.TWILIO_SID, settings.TWILIO_AUTH_TOKEN)
    app.state.twilio_client = twilio_client

    yield
    session.close()
    driver.close()



app = FastAPI(lifespan=lifespan,
              title="Connect3",
              description="A social network",
              version="0.1.0",)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(auth_router)

@app.get("/")
async def root(current_user: Annotated[UserInDb, Depends(get_current_user)]):
    return {"message": "Welcome to Connect3"}


