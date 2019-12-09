import {JwtPayload} from '../../lib/shared/jwt.payload';
import * as jwt from 'jsonwebtoken';
import {CONFIG} from '../../lib/config/config';

export class AuthUtil {

  static generateJWT(email: string, teamId: string): string {
    const payload: JwtPayload = {
      email,
      team: teamId,
      iat: Date.now()
    };
    return jwt.sign(payload, CONFIG.jwtSecret, {
      expiresIn: 30 * 24 * 60 * 60 * 1000
    });
  }

  static decodeJWT(tokenOrHeader: string): JwtPayload {
    if (tokenOrHeader && tokenOrHeader.toLowerCase().startsWith('bearer ')) {
      tokenOrHeader = tokenOrHeader.replace('bearer ', '');
      tokenOrHeader = tokenOrHeader.replace('Bearer ', '');
    }
    return jwt.verify(tokenOrHeader, CONFIG.jwtSecret, {ignoreExpiration: false}) as JwtPayload;
  }

}
