import {BatchService} from '../src/batch.service';

const id = 'pzPPKLr4-http%3Agoogle.nl';
// const id = 'uDG4gVGA-https%3Acheckout-dot-mistergreen-direct-production.appspot.comapiwololo';

beforeEach(() => {
  process.env.GCLOUD_PROJECT = 'dasher-253813';
});

describe('Polling', () => {

  test('Disabled', async () => {
    const uptime = await BatchService.repo.get(id);
    const disabled = BatchService.disabledNow(uptime.disabledHours, uptime.id);
    expect(disabled).toBe(true);
  });

  test('Disabled filtered out', async () => {
    const uptime = await BatchService.repo.get(id);
    const disabled = BatchService.filterDisabled([uptime]);
    expect(disabled.length).toBe(0);
  });

});
