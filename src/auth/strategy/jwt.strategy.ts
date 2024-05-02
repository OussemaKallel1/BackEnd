import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService, private prisma : PrismaService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
          });
        }

        async validate(payload: any) {
          const { sub: userId, username } = payload;
          // Vous pouvez ajouter d'autres vérifications ici, comme la recherche de l'utilisateur dans la base de données
          // à partir de l'ID d'utilisateur extrait du jeton JWT
          const user = await this.prisma.user.findUnique({
            where: { id: userId },
          });
          if (!user) {
            throw new UnauthorizedException();
          }
          return { userId, username };
        }
    }

