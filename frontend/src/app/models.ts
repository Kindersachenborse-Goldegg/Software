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