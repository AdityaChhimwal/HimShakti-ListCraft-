
from fastapi.security import OAuth2PasswordRequestForm
from models.user import UserRegister, UserLogin
from fastapi import Depends
import google.generativeai as genai
import os
from dotenv import load_dotenv
from models.ai import AIRequest
from database import users_collection
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi import Request
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    verify_token,
)
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from models.product import Product
from database import products_collection
from bson import ObjectId

app = FastAPI(title="HimShakti ListCraft API")
load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("models/gemini-3.5-flash")

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


products = [
    {
        "id": 1,
        "name": "Millet Cookies",
        "description": "Healthy millet cookies",
        "tone": "Health-Focused"
    },
    {
        "id": 2,
        "name": "Apricot Jam",
        "description": "Traditional Himalayan apricot jam",
        "tone": "Traditional"
    }
]

@app.get("/")
def home():
    return {"message": "HimShakti ListCraft Backend Running"}

@limiter.limit("5/minute")
@app.post("/api/auth/register")
def register(request: Request, user: UserRegister):

    existing = users_collection.find_one({"email": user.email})

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    users_collection.insert_one({
        "email": user.email,
        "password": hash_password(user.password)
    })

    return {"message": "User registered successfully"}


@limiter.limit("5/minute")
@app.post("/api/auth/login")
def login(request: Request, user: UserLogin):

    db_user = users_collection.find_one(
        {"email": user.email}
    )

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(
        {"sub": user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }
@limiter.limit("5/minute")
@app.post("/api/auth/token")
def login_oauth(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends()
):

    db_user = users_collection.find_one(
        {"email": form_data.username}
    )

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(form_data.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(
        {"sub": form_data.username}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

# GET ALL
@app.get("/api/products")
def get_products():
    product_list = []

    for product in products_collection.find():
        product["id"] = str(product["_id"])
        del product["_id"]
        product_list.append(product)

    return product_list

# GET SINGLE

@app.get("/api/products/{product_id}")
def get_product(product_id: str):
    product = products_collection.find_one({"_id": ObjectId(product_id)})

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product["id"] = str(product["_id"])
    del product["_id"]

    return product

# CREATE
@app.post("/api/products", status_code=status.HTTP_201_CREATED)
def create_product(product: Product):

    product_data = product.model_dump()

    result = products_collection.insert_one(product_data)

    return {
        "id": str(result.inserted_id),
        "name": product_data["name"],
        "description": product_data["description"],
        "tone": product_data["tone"]
    }
# UPDATE
@app.put("/api/products/{product_id}")
def update_product(product_id: str, updated: Product):

    result = products_collection.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": updated.model_dump()}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")

    product = products_collection.find_one({"_id": ObjectId(product_id)})

    product["id"] = str(product["_id"])
    del product["_id"]

    return product

# DELETE
@app.delete("/api/products/{product_id}", status_code=204)
def delete_product(product_id: str):

    result = products_collection.delete_one(
        {"_id": ObjectId(product_id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")

# SEARCH
@app.get("/api/search")
def search_products(q: str):

    products = []

    cursor = products_collection.find(
        {
            "name": {
                "$regex": q,
                "$options": "i"
            }
        }
    )

    for product in cursor:
        product["id"] = str(product["_id"])
        del product["_id"]
        products.append(product)

    return products

@app.get("/api/profile")
def profile(user=Depends(verify_token)):
    return {
        "message": "Protected route accessed successfully",
        "user": user
    }
@app.post("/api/ai/generate")
def generate_description(data: AIRequest):
    try:
        prompt = f"""
You are a professional marketing copywriter.

Generate a compelling product description.

Product Name: {data.product_name}

Current Description:
{data.description}

Tone:
{data.tone}

Return only the improved marketing description.
"""

        response = model.generate_content(prompt)

        return {
            "generated_text": response.text
        }

    except Exception as e:
        print("GEMINI ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
