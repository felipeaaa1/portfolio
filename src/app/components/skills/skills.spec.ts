import { TestBed } from '@angular/core/testing';

import { Skills } from './skills';

describe('Skills', () => {
  it('should render all categories and known technologies', async () => {
    await TestBed.configureTestingModule({ imports: [Skills] }).compileComponents();
    const fixture = TestBed.createComponent(Skills);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('.skills__card')).toHaveLength(6);
    expect(element.textContent).toContain('Backend');
    expect(element.textContent).toContain('Angular');
    expect(element.textContent).toContain('PostgreSQL');
    expect(element.textContent).toContain('Docker');
  });
});
