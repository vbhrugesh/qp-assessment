import { IBase } from "./IBase";
import { IProductCategory } from "./IProductCategory";

export interface IProduct extends IBase {
    id: string;
    name: string;
    description: string;
    category: IProductCategory;
    price: number;
    quantiity: number;
}