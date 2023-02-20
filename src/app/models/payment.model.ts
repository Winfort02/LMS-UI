import { CustomerModel } from "./customer.model";
import { OrderModel } from "./order.model";
import { UserModel } from "./user.model";

export class PaymentModel {
  id?: number = 0;
  order_id: number = 0;
  order!: OrderModel;
  customer_id: number = 0;
  customer!: CustomerModel;
  user_id?: number;
  user!: UserModel;
  payment_date: any = new Date();
  due_amount: number = 0;
  payment_type: string = '';
  amount: number = 0;
  current_amount: number = 0;
  remarks: string = '-';
  status: boolean = true;
}