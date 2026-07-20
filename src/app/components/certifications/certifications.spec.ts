import { TestBed } from '@angular/core/testing';

import { Certifications } from './certifications';

describe('Certifications', () => {
  it('should render the two completed certifications', async () => {
    await TestBed.configureTestingModule({ imports: [Certifications] }).compileComponents();
    const fixture = TestBed.createComponent(Certifications);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('.certifications__list > li')).toHaveLength(2);
    expect(element.textContent).toContain('proficiência em inglês');
    expect(element.textContent).toContain('Programação Orientada a Objetos');
  });
});
