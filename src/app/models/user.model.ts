export class UserModel {
  id?: number =  0;
  username: string = '';
  name: string = '';
  email: string = '';
  password: string = '';
  password_confirmation?: string = '';
  user_type: string = '';
  is_active: boolean = false;
}