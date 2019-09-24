import {Block, BlockInput, Button, ButtonInput} from '../../lib/shared/graphql-types';
import uuid = require('uuid/v1');

export class DashboardAdapter {

  static toBlock(input: BlockInput): Block {
    const now = new Date();
    return {
      id: uuid(),
      createdAt: now,
      updatedAt: now,
      name: input.name,
      buttons: input.buttons.map(b => DashboardAdapter.toButton(b)),
    };
  }

  static toButton(input: ButtonInput): Button {
    const now = new Date();
    return {
      ...input,
      id: uuid(),
      createdAt: now,
      updatedAt: now,
    };
  }
}
