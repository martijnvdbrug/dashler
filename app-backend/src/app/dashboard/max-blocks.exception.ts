import {ApolloError} from 'apollo-server-errors';
import {ErrorCode} from '../../lib/shared/error-code';

export class MaxBlocksException extends ApolloError {

  constructor(message: string) {
    super(message , ErrorCode.MaxBlocksException);
  }

}
