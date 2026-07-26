from pydantic import BaseModel

class AIRequest(BaseModel):
    product_name: str
    description: str
    tone: str