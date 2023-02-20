import { CustomerModel } from "./customer.model";
import { OrderDetailModel } from "./order-detail.model";
import { UserModel } from "./user.model";

export class OrderModel {
  id?: number = 0;
  customer_id: number = 0;
  customer!: CustomerModel;
  user_id: number = 0;
  user!: UserModel;
  transaction_number: string = '0000000000';
  sales_order_number: string = '';
  sales_date: any = new Date();
  items!: Array<OrderDetailModel>;
  order_details!: Array<OrderDetailModel>;
  total_amount: number = 0;
  order_status: string = '';
  sales_type: string = '';
  remarks: string = '-';
  status: boolean = false;
  cash?: number;
}