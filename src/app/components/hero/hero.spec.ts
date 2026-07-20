import { TestBed } from '@angular/core/testing';

import { Hero } from './hero';

describe('Hero', () => {
  it('should render Felipe Alves as the page heading', async () => {
    await TestBed.configureTestingModule({ imports: [Hero] }).compileComponents();
    const fixture = TestBed.createComponent(Hero);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Felipe Alves');
  });

  it('should link the scroll indicator to the About section', async () => {
    await TestBed.configureTestingModule({ imports: [Hero] }).compileComponents();
    const fixture = TestBed.createComponent(Hero);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.hero__scroll-indicator')?.getAttribute('href')).toBe('#sobre');
  });

  it('should keep the full name in the DOM and hide particles from assistive technology', async () => {
    await TestBed.configureTestingModule({ imports: [Hero] }).compileComponents();
    const fixture = TestBed.createComponent(Hero);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.hero__typewriter')?.textContent).toBe('Felipe Alves');
    expect(element.querySelector('.hero__backdrop')?.getAttribute('aria-hidden')).toBe('true');
  });
});
