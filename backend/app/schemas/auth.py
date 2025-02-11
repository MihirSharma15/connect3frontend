from pydantic_extra_types.phone_numbers import PhoneNumber
from pydantic import BaseModel

from backend.app.schemas.usphonenumber import USPhoneNumber

class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenData(BaseModel):
    phonenumber: USPhoneNumber | None = None