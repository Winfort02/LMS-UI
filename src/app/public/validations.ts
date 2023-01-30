export class validations {

  // REGX
  public static nameValidation: string = "[a-zA-Z ]*";

  public static emailValidation: string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";

  public static numberValidation: string = "^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$";

  public static passwordValidation: string = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}';

  
}