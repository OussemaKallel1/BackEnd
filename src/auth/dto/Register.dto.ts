import {  IsNotEmpty, IsString,  } from "class-validator";

export class RegisterDto {
 
    @IsString()
    name: string;

    @IsString()
    @IsNotEmpty()
    
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}