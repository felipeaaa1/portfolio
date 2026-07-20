import { TestBed } from '@angular/core/testing';

import { Experience } from './experience';

describe('Experience', () => {
  async function render(): Promise<HTMLElement> {
    await TestBed.configureTestingModule({ imports: [Experience] }).compileComponents();
    const fixture = TestBed.createComponent(Experience);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('should render all experiences in reverse chronological order', async () => {
    const element = await render();
    const cards = Array.from(element.querySelectorAll<HTMLElement>('.timeline__card'));

    expect(cards).toHaveLength(5);
    expect(cards[0]?.textContent).toContain('TXN/Infox');
    expect(cards[4]?.textContent).toContain('GSH Gestão Hospitalar');
  });

  it('should render roles, companies, technologies and time elements', async () => {
    const element = await render();

    expect(element.textContent).toContain('Engenheiro de Software');
    expect(element.textContent).toContain('PostgreSQL');
    expect(element.querySelectorAll('time').length).toBeGreaterThanOrEqual(5);
  });
});
