import {BlockInput, Button, ButtonInput} from '../../lib/shared/graphql-types';
import {BlockEntity} from './model/block.entity';
import shortid = require('shortid');

export class DashboardAdapter {

  static toBlock(input: BlockInput, uptimeId: string, blockId?: string): BlockEntity {
    const now = new Date();
    return {
      id: blockId ? blockId : shortid.generate(),
      createdAt: now,
      updatedAt: now,
      name: input.name,
      uptimeId,
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
