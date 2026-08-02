import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

db = client["himshakti_listcraft"]

products_collection = db["products"]

users_collection = db["users"]

users_collection = db["users"]
