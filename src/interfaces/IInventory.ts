import { IBase } from "./IBase";
import { IProduct } from "./IProduct";

export interface IInventory extends IBase {
    id: string;
    product: IProduct
    quantityInStock: number
    lastUpdated: Date
}