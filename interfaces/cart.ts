import { ISize } from "./";

export interface ICartProduct {
    _id: string;
    image: string;
    price: number;
    size?: ISize;
    slug: string;
    title: string;
    inStock: number;
    gender: 'men'|'women'|'kid'|'unisex';
    quantity: number;
}

export interface IOrderDetail {
    numberOfItems: number,
    subTotal: number;
    tax: number;
    total: number;
}