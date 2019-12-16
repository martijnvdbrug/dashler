import {FormControl, FormGroup} from '@angular/forms';
import {Block, BlockInput, ButtonInput, HourRange, UptimeCheckInput} from '../../../lib/shared/graphql-types';

export class AddBlockFormgroup extends FormGroup {

  constructor() {
    super({
      name: new FormControl(),
      uptimeCheck: new FormControl(),
      uptimeUrl: new FormControl(),
      uptimeDisabledHours: new FormControl(),
      disableFrom: new FormControl(),
      disableTo: new FormControl(),
      uptimeInterval: new FormControl(),
      uptimeWebhook: new FormControl(),
      button1Label: new FormControl(),
      button1Url: new FormControl(),
      button2Label: new FormControl(),
      button2Url: new FormControl(),
      button3Label: new FormControl(),
      button3Url: new FormControl(),
    });
  }

  getBlockInput(): BlockInput {
    const buttons: ButtonInput[] = [];
    if (this.value.button1Label) {
      buttons.push({
        label: this.value.button1Label,
        url: this.value.button1Url
      });
    }
    if (this.value.button2Label) {
      buttons.push({
        label: this.value.button2Label,
        url: this.value.button2Url
      });
    }
    if (this.value.button3Label) {
      buttons.push({
        label: this.value.button3Label,
        url: this.value.button3Url
      });
    }
    const disabledHours: HourRange = this.createDisabledHours();
    const uptimecheck: UptimeCheckInput = this.value.uptimeCheck ? {
      disabledHours,
      interval: this.value.uptimeInterval ? this.value.uptimeInterval : 60,
      url: this.value.uptimeUrl,
      webhook: this.value.uptimeWebhook,
    } : undefined;
    return {
      name: this.value.name,
      uptimecheck,
      buttons
    };
  }

  setValues(block: Block): void {

    this.patchValue({
      name: 'Testing'

    });

/*    name: new FormControl(),
      uptimeCheck: new FormControl(),
      uptimeUrl: new FormControl(),
      uptimeDisabledHours: new FormControl(),
      disableFrom: new FormControl(),
      disableTo: new FormControl(),
      uptimeInterval: new FormControl(),
      uptimeWebhook: new FormControl(),
      button1Label: new FormControl(),
      button1Url: new FormControl(),
      button2Label: new FormControl(),
      button2Url: new FormControl(),
      button3Label: new FormControl(),
      button3Url: new FormControl(),*/

  }

  /**
   * Create timezone dependant date from hours
   */
  createDisabledHours(): HourRange {
    if (!this.value.uptimeDisabledHours) {
      return undefined;
    }
    const from = new Date();
    from.setHours(this.value.disableFrom);
    const to = new Date();
    to.setHours(this.value.disableTo);
    return {
      from,
      to,
    };
  }

}
