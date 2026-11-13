# HimShakti ListCraft Backend

FastAPI service for product listings, registration, JWT login and Gemini-powered product descriptions.

See the [main README](../README.md#run-locally) for the complete setup, environment variables and frontend configuration. Install all dependencies from `requirements.txt` and run these commands from this `backend` directory after activating the virtual environment:

```bash
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

- Local API: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Interactive documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- [Endpoint overview](../README.md#api-overview)

## Configuration

Copy `.env.example` to `.env` in this directory. Set `MONGO_URI`, `JWT_SECRET` and `GEMINI_API_KEY`. Keep credentials out of source control.

The database is named `himshakti_listcraft`. The `users` collection stores email addresses and hashed passwords; the `products` collection stores product names, descriptions and writing tones.

![Product database schema](W5_SchemaDiagram_TBI-26101125.png)

## Implementation notes

- `main.py` defines API routes, CORS and the Gemini prompt.
- `auth.py` hashes passwords and creates or verifies JWTs.
- `database.py` connects to MongoDB.
- `models/` contains request validation models.
- Logout removes the JWT from browser local storage; it does not revoke an already-issued token.
- JWT verification protects `/api/profile`. Product and AI generation endpoints do not currently enforce bearer-token authorization or per-user product ownership.

Gemini generation needs a valid key, available quota and access to the model configured in `main.py`. Generated copy should be reviewed for factual accuracy.
