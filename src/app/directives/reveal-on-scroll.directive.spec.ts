import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { RevealOnScrollDirective } from './reveal-on-scroll.directive';

@Component({
  imports: [RevealOnScrollDirective],
  template: '<p appRevealOnScroll>Conteúdo sempre legível</p>'
})
class TestHost {}

describe('RevealOnScrollDirective', () => {
  it('should keep content rendered as progressive enhancement', async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    const fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Conteúdo sempre legível');
  });
});
