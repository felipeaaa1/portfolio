import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialSidebar } from './social-sidebar';

describe('SocialSidebar', () => {
  let component: SocialSidebar;
  let fixture: ComponentFixture<SocialSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render secure external social links', () => {
    const links = fixture.nativeElement.querySelectorAll('.social-sidebar__link') as NodeListOf<HTMLAnchorElement>;

    expect(links).toHaveLength(3);
    for (const link of links) {
      expect(link.target).toBe('_blank');
      expect(link.rel).toContain('noopener');
      expect(link.rel).toContain('noreferrer');
      expect(link.getAttribute('aria-label')).toBeTruthy();
    }
  });
});
