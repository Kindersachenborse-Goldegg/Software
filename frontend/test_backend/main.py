from fastapi import FastAPI, HTTPException, Depends, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Annotated, Literal
from asyncio import sleep

def readHeader(authorization: Annotated[str, Header()]):
    return authorization

def readToken(header: Annotated[str, Depends(readHeader)]) -> str:
    return header.split(" ", maxsplit=1)[1]

Token = Annotated[str, Depends(readToken)]

# Idee: 418 senden wenn zb register auf einem internal only system aufgerufen wird

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    response = await call_next(request)
    await sleep(0.25)
    return response

class LoginRequestModel(BaseModel):
    username: str
    password: str

class LoginResponseModel(BaseModel):
    token: str

class ResetPasswordModel(BaseModel):
    email: str

class SetPasswordModel(BaseModel):
    secret: str
    password: str

class RegisterModel(BaseModel):
    firstname: str
    lastname: str
    email: str
    phone: str
    city: str
    password: str
    accept_tnc: Literal[True]

class RegisterResponseModel(BaseModel):
    nickname: str

@app.post("/api/login")
async def login(loginModel: LoginRequestModel) -> LoginResponseModel:
    if loginModel.username == "user":
        return LoginResponseModel(token="TOKEN_" + loginModel.username)

    raise HTTPException(
        status_code=401,
        detail="benutzername/passwort nicht korrekt"
    )

@app.post("/api/register")
async def register(model: RegisterModel) -> RegisterResponseModel:
    if model.email == "used":
        raise HTTPException(
            status_code=409,
            detail="Email bereits verwendet"
        )

    if model.email == "voll":
        raise HTTPException(
            status_code=403,
            detail="keine Plätze verfügbar"
        )

    return RegisterResponseModel(nickname="nick_" + model.email)

@app.post("/api/reset-password")
async def reset_password(model: ResetPasswordModel) -> str:
    # die richtige url lautet: <frontend>/public/set-password?sec=<secret>
    print("Password reset for user:", repr(model.email), repr(f"supersecret_{hash(model.email)}"))
    return "OK"

@app.post("/api/set-password")
async def set_password(model: SetPasswordModel) -> str:
    if model.secret.startswith("supersecret"):
        print("Password set to:", repr(model.password), "using secret", repr(model.secret))
        return "OK"

    raise HTTPException(
        status_code=404,
        detail="secret nicht gefunden"
    )