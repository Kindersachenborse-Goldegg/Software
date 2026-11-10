from fastapi import FastAPI, HTTPException, Depends, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Annotated, Literal, Optional, List
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

class PublicItemModel(BaseModel):
    name: str
    size: Optional[str]
    pice: int
    barcode: int
    positionInList: int

class ListModel(BaseModel):
    id: int
    userId: int
    name: str
    maxItemCount: int
    items: List[PublicItemModel]

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

@app.get("/api/list")
async def get_my_lists() -> List[ListModel]:
    return [
        ListModel(id=0, userId=0, name="Apfel 1", maxItemCount=60, items=[]),
        ListModel(id=1, userId=0, name="Apfel 2", maxItemCount=3, items=[
            PublicItemModel(name="T-Shirt", size=None, pice=5, barcode=123456789124, positionInList=1),
            PublicItemModel(name="Host", size="30/32", pice=5, barcode=123456789125, positionInList=2)
        ]),
        ListModel(id=2, userId=0, name="Schneewittchen 3", maxItemCount=1, items=[
            PublicItemModel(name="T-Shirt", size="S", pice=5, barcode=123456789123, positionInList=1)
        ])
    ]

@app.post("/api/list")
async def create_new_list() -> List[ListModel]:
    raise HTTPException(
        status_code=403,
        detail="Leider kein Platz mehr frei :("
    )
    return [
        ListModel(id=0, userId=0, name="Apfel 1", maxItemCount=60, items=[]),
        ListModel(id=1, userId=0, name="Apfel 2", maxItemCount=3, items=[
            PublicItemModel(name="T-Shirt", size=None, pice=5, barcode=123456789124, positionInList=1),
            PublicItemModel(name="Host", size="30/32", pice=5, barcode=123456789125, positionInList=2)
        ]),
        ListModel(id=2, userId=0, name="Schneewittchen 3", maxItemCount=1, items=[
            PublicItemModel(name="T-Shirt", size="S", pice=5, barcode=123456789123, positionInList=1)
        ]),
        ListModel(id=3, userId=0, name="Zwackelmann 1", maxItemCount=20, items=[])
    ]