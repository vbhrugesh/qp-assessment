
import { IBase } from "./IBase";
import { IOrderItem } from "./IOrderItem";
import { IUser } from "./IUser"

export interface IOrder extends IBase {
  id: string
  user: IUser
  orderDate: Date;
  totalAmount: number
  orderItems: IOrderItem[]
}
