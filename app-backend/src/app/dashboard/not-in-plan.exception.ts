import {ApolloError} from 'apollo-server-errors';

export class NotInPlanException extends ApolloError {

  constructor(message: string) {
    super(message, NotInPlanException.name);
  }

}
