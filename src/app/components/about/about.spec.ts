import { TestBed } from '@angular/core/testing';

import { About } from './about';

describe('About', () => {
  it('should render the heading and essential profile text', async () => {
    await TestBed.configureTestingModule({ imports: [About] }).compileComponents();
    const fixture = TestBed.createComponent(About);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent).toContain('Sobre mim');
    expect(element.textContent).toContain('foco em Java e aplicações web');
  });
});
