import { HierarchyPage } from './app.po';

describe('hierarchy App', () => {
  let page: HierarchyPage;

  beforeEach(() => {
    page = new HierarchyPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
