import { FuelPage } from './app.po';

describe('fuel App', function() {
  let page: FuelPage;

  beforeEach(() => {
    page = new FuelPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
