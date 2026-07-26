import google.generativeai as genai
import os
from dotenv import load_dotenv

print("1. Starting")

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

print("2. API configured")

model = genai.GenerativeModel("models/gemini-3.5-flash")

print("3. Model created")

response = model.generate_content("Say hello in one sentence.")

print("4. Response received")

print(response.text)