import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

class RegisterDto {
    constructor(first_name: string, last_name: string, email: string, password: string) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
    }
    @IsNotEmpty()
    public first_name: string;
    @IsNotEmpty()
    public last_name: string;
    @IsNotEmpty() @IsEmail()
    public email: string;
    @IsNotEmpty()
    @MinLength(6)
    public password: string;
}
export default RegisterDto;