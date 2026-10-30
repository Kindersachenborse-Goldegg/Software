from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class LoginRequestModel(BaseModel):
    username: str
    password: str

class LoginResponseModel(BaseModel):
    token: str

@app.post("/api/login")
async def login(loginModel: LoginRequestModel) -> LoginResponseModel:
    if loginModel.username == "user":
        return LoginResponseModel(token="TOKEN_" + loginModel.username)

    raise HTTPException(
        status_code=401,
        detail="benutzername/passwort nicht korrekt"
    )