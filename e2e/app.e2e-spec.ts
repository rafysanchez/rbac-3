import { RbacPage } from './app.po';

describe('rbac App', function() {
  let page: RbacPage;

  beforeEach(() => {
    page = new RbacPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
