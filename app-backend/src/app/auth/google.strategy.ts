import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy} from 'passport-google-oauth20';
import {CONFIG} from '../../lib/config/config';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor() {
    super({
      clientID: CONFIG.goolgeClientId,     // <- Replace this with your client id
      clientSecret: CONFIG.googleClientSecret, // <- Replace this with your client secret
      callbackURL: 'http://localhost:8999/auth/google/callback',
      passReqToCallback: true,
      scope: ['profile']
    });
  }


  async validate(request: any, accessToken: string, refreshToken: string, profile, done: Function, more) {
    try {
      console.log('success', profile);
      console.log('success', more);
      const jwt = 'placeholderJWT';
      const user = {jwt};
      done(null, user);
    } catch (err) {
      console.log(err);
      done(err, false);
    }
  }

}
