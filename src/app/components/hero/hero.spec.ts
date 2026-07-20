import { TestBed } from '@angular/core/testing';

import { Hero } from './hero';

describe('Hero', () => {
  it('should render Felipe Alves as the page heading', async () => {
    await TestBed.configureTestingModule({ imports: [Hero] }).compileComponents();
    const fixture = TestBed.createComponent(Hero);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Felipe Alves');
  });
});
