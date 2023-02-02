import { UserModel } from "./user.model";

export class LogModel {
  id?: number = 0;
  logs: string = '';
  remarks: string = '-';
  date: any;
  user: UserModel = new UserModel();
}