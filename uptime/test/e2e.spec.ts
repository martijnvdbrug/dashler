import {BatchService} from '../src/batch.service';

const id = 'pzPPKLr4-http%3Agoogle.nl';
// const id = 'uDG4gVGA-https%3Acheckout-dot-mistergreen-direct-production.appspot.comapiwololo';

beforeEach(() => {
  process.env.GCLOUD_PROJECT = 'dasher-253813';
});

describe('Polling', () => {

  test('Should be disabled', async () => {
    const from = new Date();
    from.setHours(8);
    const to = new Date();
    to.setHours(6);
    const disabled = BatchService.disabledNow({from, to}, 'bogus-id');
    expect(disabled).toBe(true);
  });

  test('Disabled filtered out', async () => {
    const uptime = await BatchService.repo.get(id);
    const disabled = BatchService.filterDisabled([uptime]);
    expect(disabled.length).toBe(0);
  });

  test.only('Disabled test', async () => {
    expect(BatchService.isDisabled(23, 7, 22)).toBe(false);
    expect(BatchService.isDisabled(23, 7, 23)).toBe(true);
    expect(BatchService.isDisabled(23, 7, 24)).toBe(true);
    expect(BatchService.isDisabled(23, 7, 0)).toBe(true);
    expect(BatchService.isDisabled(23, 7, 6)).toBe(true);
    expect(BatchService.isDisabled(23, 7, 8)).toBe(false);
    expect(BatchService.isDisabled(1, 21, 20)).toBe(true);
    expect(BatchService.isDisabled(1, 21, 22)).toBe(false);
    expect(BatchService.isDisabled(1, 21, 21)).toBe(false);
  });

});
