import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/Guard/jwt-guard';

@Controller('users')
export class UserController {

    @Get()
    @UseGuards(JwtGuard)
    getUsers() {
        return 'All users';
    }

}
