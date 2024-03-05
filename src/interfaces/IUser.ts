import { IBase } from "./IBase";
import { IOrder } from "./IOrder";

export interface IUser extends IBase {
    id: string;
    role: string;
    email: string;
    orders?: IOrder[]
}