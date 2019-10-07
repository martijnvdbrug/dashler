import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy} from 'passport-google-oauth20';
import {CONFIG} from '../../lib/config/config';
import {GoogleUser} from './model/google.user';
import {AuthService} from './auth.service';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(
    private authService: AuthService
  ) {
    super({
      clientID: CONFIG.goolgeClientId,     // <- Replace this with your client id
      clientSecret: CONFIG.googleClientSecret, // <- Replace this with your client secret
      callbackURL: 'http://localhost:8999/auth/google/callback',
      passReqToCallback: true,
      scope: ['profile', 'email']
    });
  }

  async validate(request: any, accessToken: string, refreshToken: string, profile: GoogleUser, done: (err: any, obj: any) => void) {
    try {
      console.log(`User logged in with Google: ${profile._json.email}`);
      const jwt = await this.authService.signUpOrLogin({
        email: profile._json.email,
        picture: profile._json.picture,
        firstname: profile._json.given_name,
        familyname: profile._json.family_name,
        locale: profile._json.locale,
        originId: profile._json.sub,
        provider: profile.provider
      });
      const user = {jwt};
      done(null, user);
    } catch (err) {
      console.log(`Error trying to login with Google: ${err}`);
      done(err, false);
    }
  }

}
