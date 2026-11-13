from fastapi import FastAPI, HTTPException, Depends, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Annotated, Literal, Optional, List
from asyncio import sleep
import random
import hashlib

def readHeader(authorization: Annotated[str, Header()]):
    return authorization

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

class UserModel(RegisterModel, RegisterResponseModel):
    id: int

class PublicItemModel(BaseModel):
    name: str
    size: Optional[str]
    price: int
    barcode: int
    deleted: bool
    positionInList: int

class ListModel(BaseModel):
    id: int
    userId: int
    name: str
    maxItemCount: int
    items: List[PublicItemModel]

class UpdateItemModel(BaseModel):
    deleted: bool

class CreateItemModel(BaseModel):
    name: str
    price: int
    size: str

class PrintListResponse(BaseModel):
    unauthenticatedUrl: str

def readToken(header: Annotated[str, Depends(readHeader)]) -> UserModel:
    userid = int(header.split(" ", maxsplit=1)[1])
    for user in users:
        if userid == user.id:
            return user

    raise HTTPException(status_code=401, detail="invalid token")

Token = Annotated[UserModel, Depends(readToken)]

@app.post("/api/login")
async def login(loginModel: LoginRequestModel) -> LoginResponseModel:
    for user in users:
        if user.email == loginModel.username and user.password == loginModel.password:
            return LoginResponseModel(token=str(user.id))

    raise HTTPException(
        status_code=401,
        detail="benutzername/passwort nicht korrekt"
    )

@app.post("/api/register")
async def register(model: RegisterModel) -> RegisterResponseModel:
    for user in users:
            if user.email == model.email:
                raise HTTPException(
                            status_code=409,
                            detail="Email bereits verwendet"
                        )

    if len(users) >= 2:
        if model.email == "voll":
            raise HTTPException(
                status_code=403,
                detail="keine Plätze verfügbar"
            )

    users.append(UserModel(id=len(users), nickname="Traube", email=model.email, password=model.password, firstname=model.firstname, lastname=model.lastname, phone=model.phone, city=model.city, accept_tnc=model.accept_tnc))

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

users = [
    UserModel(id=0, nickname="Birne", firstname="Noah", lastname="Rottermanner", email="user", phone="1245789", city="Goldegg", password="user", accept_tnc=True)
]

lists = [ListModel(id=0, userId=0, name="Apfel 1", maxItemCount=60, items=[]),
        ListModel(id=1, userId=0, name="Apfel 2", maxItemCount=3, items=[
            PublicItemModel(name="T-Shirt", size=None, price=5, barcode=123456789124, positionInList=6, deleted=False),
            PublicItemModel(name="Hose", size="30/32", price=5, barcode=123456789125, positionInList=2, deleted=True),
            PublicItemModel(name="T-Shirt", size=None, price=5, barcode=123456789126, positionInList=3, deleted=False),
            PublicItemModel(name="T-Shirt", size=None, price=5, barcode=123456789127, positionInList=4, deleted=True),
            PublicItemModel(name="T-Shirt", size=None, price=5, barcode=123456789128, positionInList=5, deleted=False),
            PublicItemModel(name="First", size=None, price=5, barcode=123456789129, positionInList=1, deleted=False),
            PublicItemModel(name="T-Shirt", size=None, price=5, barcode=123456789121, positionInList=7, deleted=False),
            PublicItemModel(name="T-Shirt", size=None, price=500, barcode=123456789122, positionInList=8, deleted=False),
            PublicItemModel(name="T-Shirt", size=None, price=5, barcode=123456789123, positionInList=9, deleted=False),
            PublicItemModel(name="T-Shirt", size=None, price=5, barcode=123456789120, positionInList=10, deleted=True),
        ]),
        ListModel(id=2, userId=0, name="Schneewittchen 3", maxItemCount=1, items=[
            PublicItemModel(name="T-Shirt", size="S", price=5, barcode=123456789130, positionInList=1, deleted=False)
        ])]

@app.get("/api/list")
async def get_my_lists(user: Token) -> List[ListModel]:
    return [x for x in lists if x.userId == user.id]

@app.post("/api/list")
async def create_new_list(user: Token) -> List[ListModel]:
    if len(lists) >= 15:
        raise HTTPException(
            status_code=403,
            detail="Leider kein Platz mehr frei :("
        )

    countwithname = 0
    for list in lists:
        if list.userId == user.id and list.name.startswith(user.nickname):
            countwithname += 1

    if countwithname == 0:
        countwithname = ""

    lists.append(ListModel(id=len(lists), userId=user.id, name=f"{user.nickname} {countwithname}", maxItemCount=60, items=[]))
    
    return [x for x in lists if x.userId == user.id]

@app.post("/api/item/{id:int}")
async def updateItem(id: int, dto: UpdateItemModel, user: Token) -> ListModel:
    for list in lists:
        if list.userId != user.id:
            continue

        for item in list.items:
            if item.barcode == id:
                item.deleted = dto.deleted

                return list

@app.post("/api/list/{id:int}")
async def updateList(id: int, dto: CreateItemModel, user: Token) -> ListModel:
    for list in lists:
        if list.userId != user.id or list.id != id:
            continue

        list.items.append(PublicItemModel(name=dto.name, size=None if dto.size == "" else dto.size, price=dto.price, barcode=random.randint(int(1e13),int(1e14-1)), positionInList=len(list.items) + 1, deleted=False))

        return list

SECRET = "fdsjagsddrer213432t54fasd63"

@app.post("/api/list/{id:int}/print")
async def printList(id: int, user: Token) -> PrintListResponse:
    for list in lists:
        if list.userId != user.id or list.id != id:
            continue

        url = f"/api/list/{id}/print/{hashlib.sha256(f'{SECRET}{list.id}'.encode()).hexdigest()}"

        return PrintListResponse(unauthenticatedUrl=url)

@app.get("/api/list/{id:int}/print/{secret:str}")
async def printList(id: int, secret: str) -> None:
    for list in lists:
        if list.id != id or secret != hashlib.sha256(f'{SECRET}{list.id}'.encode()).hexdigest():
            continue

        return str(list)

    raise HTTPException(
        status_code=403,
        detail="invalid secret"
    )