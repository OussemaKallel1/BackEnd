import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/Register.dto';
import * as argon from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/Login.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma : PrismaService,
        private jwt: JwtService, 
        private config : ConfigService ){}

   async signUp(dto: RegisterDto){
        // Genrate the password hash
        const hash = await argon.hash(dto.password);

        // Save the new user in DB
        const user = await this.prisma.user.create({ 
            data : {
                name : dto.name,
                hash,
                username : dto.username,
            },
        });
        delete user.hash

        // return the saved user 
        return this.signToken(user.id, user.username);
    }

    async signIn (dto: LoginDto){

        // find the user by username
        const user = await this.prisma.user.findUnique({
            where : {
                username : dto.username,
            },
        });

        // if user does not exist throw exception
        if(!user) throw new ForbiddenException('Credentials incorrect');

        // compare password
        const pwMatches = await argon.verify(user.hash,dto.password,);


        // if password is incorrect throw exception
        if(!pwMatches) throw new ForbiddenException('Credentials incorrect');

       
        return this.signToken(user.id, user.username);

    }

    async signToken(userId: number, username: string): Promise<{ access_token: string} > {
        const payload = {
            sub : userId,
            username,
        };
        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(
            payload,
            {
                expiresIn: '15m',
                secret: secret
            }
        );
        
        return {
            access_token : token,
        };

    }
}

