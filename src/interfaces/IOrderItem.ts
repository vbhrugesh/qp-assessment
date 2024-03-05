import { IBase } from "./IBase";
import { IOrder } from "./IOrder";
import { IProduct } from "./IProduct";

export interface IOrderItem extends IBase {
  id: string
  order: IOrder
  product: IProduct
  quantity: number
  pricePerUnit: number
}
