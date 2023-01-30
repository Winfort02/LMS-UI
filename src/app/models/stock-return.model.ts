import { ProductModel } from "./product.model";
import { SupplierModel } from "./supplier.model";
import { UserModel } from "./user.model";

export class StockReturnModel {
  id?: number = 0;
  supplier_id: number = 0;
  supplier?: SupplierModel;
  product_id: number = 0;
  product?: ProductModel;
  user_id: number = 0;
  user?: UserModel;
  transaction_number: string = '0000000000';
  van_number: string = '';
  date: any;
  quantity: number = 0;
  remarks: string = '';
}