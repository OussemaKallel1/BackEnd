import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/Register.dto';
import { LoginDto } from './dto/Login.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto:RegisterDto) {
        
        return this.authService.signUp(dto);
    
}

    @Post('signin')
    signin(@Body() dto:LoginDto) {
        
        return this.authService.signIn(dto);
    
}


    
}