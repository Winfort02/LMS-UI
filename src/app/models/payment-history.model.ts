import { PaymentModel } from "./payment.model";
import { UserModel } from "./user.model";

export class PaymentHistoryModel {
  id?: number = 0;
  payment_id: number = 0;
  payment!: PaymentModel;
  user_id: number = 0;
  user!: UserModel;
  previous_payment: number = 0;
  current_payment: number = 0;
  date: any = new Date();
}