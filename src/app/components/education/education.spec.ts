import { TestBed } from '@angular/core/testing';

import { Education } from './education';

describe('Education', () => {
  it('should render the undergraduate degree and the MBA in progress', async () => {
    await TestBed.configureTestingModule({ imports: [Education] }).compileComponents();
    const fixture = TestBed.createComponent(Education);
    await fixture.whenStable();
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Ciência da Computação');
    expect(text).toContain('UECE');
    expect(text).toContain('MBA em Engenharia de Software');
    expect(text).toContain('USP/ESALQ');
    expect(text).toContain('Em andamento');
  });
});
