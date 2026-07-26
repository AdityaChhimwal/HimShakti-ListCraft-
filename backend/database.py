import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

db = client["himshakti_listcraft"]

<<<<<<< HEAD
products_collection = db["products"]

users_collection = db["users"]

users_collection = db["users"]
=======
products_collection = db["products"]
>>>>>>> bd449cb871fb2ecce69535a3274deb1ef5de895c
