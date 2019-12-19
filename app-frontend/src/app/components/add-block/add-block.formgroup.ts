import {FormControl, FormGroup} from '@angular/forms';
import {Block, BlockInput, ButtonInput, HourRange, UptimeCheckInput} from '../../../lib/shared/graphql-types';

export class AddBlockFormgroup extends FormGroup {

  id: string;

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
    const disabledHours: HourRange = this.createDisabledHours(this.value.disableFrom, this.value.disableTo);
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
    this.id = block.id;
    const uptimeDisabledHours = block.uptime ? block.uptime.disabledHours : undefined;
    const button1 = block.buttons[0] ? block.buttons[0] : undefined;
    const button2 = block.buttons[1] ? block.buttons[1] : undefined;
    const button3 = block.buttons[2] ? block.buttons[2] : undefined;
    this.patchValue({
      name: block.name,
      uptimeCheck: (block.uptime || block.url),
      uptimeUrl: block.url ? block.url : undefined,
      uptimeDisabledHours: !!uptimeDisabledHours,
      disableFrom: uptimeDisabledHours ? this.toCurrentHour(uptimeDisabledHours.from) : undefined,
      disableTo: uptimeDisabledHours ? this.toCurrentHour(uptimeDisabledHours.to) : undefined,
      uptimeInterval: block.uptime ? block.uptime.checkInterval : undefined,
      uptimeWebhook:  block.uptime ? block.uptime.webhook : undefined,
      button1Label: button1 ? button1.label : undefined,
      button1Url: button1 ? button1.url : undefined,
      button2Label: button2 ? button2.label : undefined,
      button2Url: button2 ? button2.url : undefined,
      button3Label: button3 ? button3.label : undefined,
      button3Url: button3 ? button3.url : undefined,
    });
  }

  /**
   * Create timezone dependant date from hours
   */
  createDisabledHours(disableFrom: number, disableTo: number): HourRange {
    const from = new Date();
    from.setHours(disableFrom);
    const to = new Date();
    to.setHours(disableTo);
    return {
      from,
      to,
    };
  }

  toCurrentHour(date: Date): number {
    return date.getHours();
  }

}
