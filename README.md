# HimShakti ListCraft

A full-stack application that helps Himalayan food entrepreneurs turn basic product information into e-commerce descriptions. Users enter a product name, an existing description and a writing tone, then review AI-generated copy and use it in a product listing.

[Live application](https://himshakti-listcraft-vercel.vercel.app) · [Backend API](https://himshakti-listcraft.onrender.com) · [Interactive API documentation](https://himshakti-listcraft.onrender.com/docs)

The hosted backend may take time to respond after inactivity.

## What it does

- Generates product descriptions through the Google Gemini API.
- Offers Friendly, Professional, Luxury and Traditional writing tones.
- Lets users copy generated text into the product form and create, edit or delete listings.
- Provides product search through the backend API.
- Implements registration, bcrypt password hashing, JWT login and a protected dashboard.
- Stores users and products in MongoDB.
- Includes a responsive React interface with light and dark themes.

This is an applied GenAI integration project. Gemini provides the language model; the repository implements the application, prompting, API integration, authentication flow and product workflow.

## Technology

| Layer | Implementation |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router, Axios |
| Backend | Python, FastAPI, Uvicorn |
| Database | MongoDB, PyMongo |
| Authentication | bcrypt through Passlib; JWT through python-jose |
| AI service | Google Gemini API through google-generativeai |
| Hosting | Vercel frontend, Render backend, MongoDB Atlas |

## Try the application

1. Open the live application, create an account and sign in.
2. Enter a product name, such as **Apricot Jam**, and a factual description of the product.
3. Select a writing tone and choose **Generate with AI**.
4. Review the result, then choose **Use as Product Description** to copy it into the product form.
5. Create a listing and try updating it.

The prompt combines the product name, current description and selected tone. The API returns generated text to the dashboard. Review that text for accuracy before using it in a real listing.

## Run locally

### Prerequisites

- Python 3 with pip and virtual environment support.
- Node.js 22.12 or later with npm. The locked Vite version also supports Node.js 20.19 or later within the 20.x series.
- A local MongoDB server or a MongoDB Atlas connection string.
- A Gemini API key with access to the model configured in `backend/main.py`.

### 1. Clone the repository

```bash
git clone https://github.com/AdityaChhimwal/HimShakti-ListCraft-.git
cd HimShakti-ListCraft-
```

### 2. Set up the backend

```bash
cd backend
python -m venv .venv
```

Activate the environment:

| Shell | Command |
| --- | --- |
| macOS / Linux | `source .venv/bin/activate` |
| Windows PowerShell | `.\.venv\Scripts\Activate.ps1` |
| Windows Command Prompt | `.venv\Scripts\activate.bat` |

```bash
python -m pip install -r requirements.txt
```

Copy `backend/.env.example` to `backend/.env` and fill in:

```dotenv
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017
JWT_SECRET=replace_with_a_long_random_secret
GEMINI_API_KEY=replace_with_your_gemini_api_key
```

The example MongoDB URI requires a running local database. For Atlas, use your own connection string, database credentials and network access configuration. The application uses the database `himshakti_listcraft` and its `users` and `products` collections.

From the `backend` directory, start the API:

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Open [the local API](http://127.0.0.1:8000) or [Swagger UI](http://127.0.0.1:8000/docs). The command explicitly sets port 8000; Uvicorn does not automatically read the `PORT` entry in `.env`.

### 3. Set up the frontend

Open a second terminal in the repository root:

```bash
npm ci
```

Create `.env.local` in that root directory:

```dotenv
VITE_API_URL=http://127.0.0.1:8000
```

```bash
npm run dev -- --host localhost --port 5173 --strictPort
```

Open [http://localhost:5173](http://localhost:5173). Use this hostname and port because the backend's local CORS configuration allows that origin. Restart Vite after changing its environment variables.

To create a frontend production build, run `npm run build`.

## API overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/` | Backend status message |
| POST | `/api/auth/register` | Create a user |
| POST | `/api/auth/login` | Sign in with JSON credentials and receive a JWT |
| POST | `/api/auth/token` | OAuth2 form-based token endpoint for API clients |
| GET | `/api/profile` | Read the signed-in user's token payload; requires a bearer token |
| GET / POST | `/api/products` | List or create products |
| GET / PUT / DELETE | `/api/products/{product_id}` | Read, update or delete a product |
| GET | `/api/search?q=jam` | Search product names |
| POST | `/api/ai/generate` | Generate a description from product details and tone |

## Repository guide

| Path | Contents |
| --- | --- |
| `src/pages/` | Home, registration, login and dashboard screens |
| `src/components/` | Navigation, forms and reusable UI components |
| `src/context/` | Theme state |
| `backend/main.py` | FastAPI routes, CORS and Gemini integration |
| `backend/auth.py` | Password hashing and JWT helpers |
| `backend/database.py` | MongoDB connection and collections |
| `backend/models/` | Request models |

## Current scope and next improvements

- The dashboard and profile flow use JWT authentication. Product and generation routes currently do not enforce bearer-token authorization, and the product catalog is shared. Per-user ownership and API authorization are next improvements.
- AI generation depends on Gemini credentials, quota and access to the model selected in the source. If a model-access error occurs, check that model against the models available to your API key.
- Generated descriptions need human review. The project does not report a measured improvement in sales or content quality.
- The backend dependencies are listed in `backend/requirements.txt` without a full version lock; reproducible dependency pinning is a future improvement.
