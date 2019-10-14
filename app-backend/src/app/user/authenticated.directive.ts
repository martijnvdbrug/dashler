import {SchemaDirectiveVisitor} from 'graphql-tools';
import {defaultFieldResolver} from 'graphql';
import {AuthenticationError} from 'apollo-server-errors';
import {AuthUtil} from './auth.util';

export class AuthenticatedDirective extends SchemaDirectiveVisitor {

  visitFieldDefinition(field, details) {
    const {resolve = defaultFieldResolver} = field;
    field.resolve = async function (...args) {
      try {
        const token = args[2].token;
        const decoded = AuthUtil.decodeJWT(token);
        if (!decoded || !decoded.email) {
          throw Error(`Could no get email from decoded jwt: ${JSON.stringify(decoded)}`);
        }
        args[2].email = decoded.email;
      } catch (e) {
        console.error(e);
        throw new AuthenticationError(`User could not be authenticated`);
      }
      return resolve.apply(this, args);
    };
  }
}
