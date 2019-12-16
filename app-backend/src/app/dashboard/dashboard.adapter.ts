import {Block, BlockInput, Button, ButtonInput} from '../../lib/shared/graphql-types';
import shortid = require('shortid');

export class DashboardAdapter {

  static toBlock(input: BlockInput, blockId?: string): Block {
    const now = new Date();
    return {
      id: blockId ? blockId : shortid.generate(),
      createdAt: now,
      updatedAt: now,
      name: input.name,
      url: input.uptimecheck ? input.uptimecheck.url : undefined,
      buttons: input.buttons.map(b => DashboardAdapter.toButton(b)),
    };
  }

  static toButton(input: ButtonInput): Button {
    const now = new Date();
    return {
      ...input,
      id: shortid.generate(),
      createdAt: now,
      updatedAt: now,
    };
  }
}
