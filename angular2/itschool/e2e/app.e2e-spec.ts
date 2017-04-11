import { ItschoolPage } from './app.po';

describe('itschool App', function() {
  let page: ItschoolPage;

  beforeEach(() => {
    page = new ItschoolPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
