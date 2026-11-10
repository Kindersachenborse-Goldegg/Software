// LIST
export interface ListModel {
    id: number,
    userId: number,
    name: string,
    maxItemCount: number,
    items: PublicItemModel[]
}

export interface PrintListModel {
    unauthenticatedUrl: string
}


// ITEM
export interface PublicItemModel {
    name: string,
    size: string, // may be empty
    pice: number // price in euro
    deleted: boolean
    barcode: number,
    positionInList: number,
}

export interface CreateItemModel {
    name: string,
    size: string,
    price: number
}

export interface ModifyItemModel {
    deleted: boolean
}

// AUTH
export interface LoginModel {
    username: string,
    password: string
}

export interface TokenResponseModel {
    token: string
}

// USER
export interface ResetPasswordRequestModel {
    email: string
}

export interface ResetPasswordModel {
    secret: string,
    password: string
}

export interface RegisterModel {
    firstname: string
    lastname: string
    phone: string
    city: string
    email: string
    password: string
    accept_tnc: boolean
}

export interface RegisterResponseModel {
    nickname: string
}