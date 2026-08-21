import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, vi } from 'vitest';

import { GithubContribution } from './github-contribution';
import { GithubActivity } from './github-activity';
interface PositionScenario {
  cardLeft: number;
  cardTop: number;
  cellLeft: number;
  cellTop: number;
  expectedAlignment: 'center' | 'left' | 'right';
  expectedPlacement: 'above' | 'below';
  name: string;
  viewportHeight: number;
  viewportWidth: number;
}

function createRect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    bottom: top + height,
    height,
    left,
    right: left + width,
    top,
    width,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

const positionScenarios: PositionScenario[] = [
  {
    name: 'first column',
    viewportWidth: 1200,
    viewportHeight: 800,
    cardLeft: 80,
    cardTop: 240,
    cellLeft: 85,
    cellTop: 500,
    expectedAlignment: 'left',
    expectedPlacement: 'above',
  },
  {
    name: 'central column',
    viewportWidth: 1200,
    viewportHeight: 800,
    cardLeft: 80,
    cardTop: 240,
    cellLeft: 600,
    cellTop: 500,
    expectedAlignment: 'center',
    expectedPlacement: 'above',
  },
  {
    name: 'penultimate column',
    viewportWidth: 1200,
    viewportHeight: 800,
    cardLeft: 80,
    cardTop: 240,
    cellLeft: 1065,
    cellTop: 500,
    expectedAlignment: 'right',
    expectedPlacement: 'above',
  },
  {
    name: 'last column',
    viewportWidth: 1200,
    viewportHeight: 800,
    cardLeft: 80,
    cardTop: 240,
    cellLeft: 1105,
    cellTop: 500,
    expectedAlignment: 'right',
    expectedPlacement: 'above',
  },
  {
    name: 'top cell',
    viewportWidth: 1200,
    viewportHeight: 800,
    cardLeft: 80,
    cardTop: -40,
    cellLeft: 600,
    cellTop: 8,
    expectedAlignment: 'center',
    expectedPlacement: 'below',
  },
  {
    name: 'bottom cell on a scrolled page',
    viewportWidth: 1200,
    viewportHeight: 800,
    cardLeft: 80,
    cardTop: -300,
    cellLeft: 600,
    cellTop: 760,
    expectedAlignment: 'center',
    expectedPlacement: 'above',
  },
  {
    name: 'last column on mobile',
    viewportWidth: 360,
    viewportHeight: 640,
    cardLeft: 16,
    cardTop: 120,
    cellLeft: 334,
    cellTop: 320,
    expectedAlignment: 'right',
    expectedPlacement: 'above',
  },
];

describe('GithubActivity', () => {
  let fixture: ComponentFixture<GithubActivity> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [GithubActivity] }).compileComponents();
  });

  afterEach(() => {
    fixture?.destroy();
    fixture = undefined;
    vi.unstubAllGlobals();
  });

  async function createComponent(
    contributions: GithubContribution[] = [],
  ): Promise<ComponentFixture<GithubActivity>> {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ contributions }),
      }),
    );

    fixture = TestBed.createComponent(GithubActivity);
    await fixture.whenStable();
    fixture.detectChanges();

    return fixture;
  }

  it('should request the public contribution history for the last year', async () => {
    await createComponent();

    expect(fetch).toHaveBeenCalledWith(
      'https://github-contributions-api.jogruber.de/v4/felipeaaa1?y=last',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('should keep contributions from the last 12 months and discard older entries', async () => {
    const today = new Date();
    const recentDate = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 11, today.getUTCDate()),
    );
    const oldDate = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 13, today.getUTCDate()),
    );
    const toDate = (date: Date): string => date.toISOString().slice(0, 10);
    const component = await createComponent([
      { date: toDate(oldDate), count: 8, level: 4 },
      { date: toDate(recentDate), count: 2, level: 2 },
      { date: toDate(today), count: 1, level: 1 },
    ]);

    expect(
      component.nativeElement.querySelectorAll('.github-card__graph .contribution-cell'),
    ).toHaveLength(2);
    expect(component.nativeElement.querySelector('.section__description')?.textContent).toContain(
      'último ano',
    );
  });

  it('should link to the configured GitHub account', async () => {
    const component = await createComponent();
    const accountLink = component.nativeElement.querySelector(
      '.github-card__account',
    ) as HTMLAnchorElement;

    expect(accountLink.href).toBe('https://github.com/felipeaaa1');
    expect(accountLink.rel).toContain('noopener');
  });

  it('should expose the contribution graph as a labelled region', async () => {
    const component = await createComponent();
    const section = component.nativeElement.querySelector('section') as HTMLElement;

    expect(section.id).toBe('github');
    expect(section.getAttribute('aria-labelledby')).toBe('github-title');
  });

  it('should show an accessible tooltip on focus and close it with Escape', async () => {
    const today = new Date().toISOString().slice(0, 10);
    const component = await createComponent([{ date: today, count: 3, level: 2 }]);
    const cell = component.nativeElement.querySelector(
      '.github-card__graph .contribution-cell',
    ) as HTMLElement;

    cell.dispatchEvent(new FocusEvent('focus'));
    component.detectChanges();
    await component.whenStable();

    const tooltip = component.nativeElement.querySelector('[role="tooltip"]') as HTMLElement;
    expect(tooltip).toBeTruthy();
    expect(cell.getAttribute('aria-describedby')).toBe('github-contribution-tooltip');

    cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    component.detectChanges();

    expect(component.nativeElement.querySelector('[role="tooltip"]')).toBeNull();
    expect(cell.hasAttribute('aria-describedby')).toBe(false);
  });
  it.each(positionScenarios)(
    'should keep the tooltip inside the viewport for $name',
    async (scenario) => {
      const originalInnerWidth = window.innerWidth;
      const originalInnerHeight = window.innerHeight;
      let positionCallback: FrameRequestCallback | undefined;

      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: scenario.viewportWidth,
      });
      Object.defineProperty(window, 'innerHeight', {
        configurable: true,
        value: scenario.viewportHeight,
      });
      vi.stubGlobal(
        'requestAnimationFrame',
        vi.fn((callback: FrameRequestCallback) => {
          positionCallback = callback;
          return 1;
        }),
      );
      vi.stubGlobal('cancelAnimationFrame', vi.fn());

      try {
        const today = new Date().toISOString().slice(0, 10);
        const component = await createComponent([{ date: today, count: 3, level: 2 }]);
        const card = component.nativeElement.querySelector('.github-card') as HTMLElement;
        const cell = component.nativeElement.querySelector(
          '.github-card__graph .contribution-cell',
        ) as HTMLElement;

        vi.spyOn(card, 'getBoundingClientRect').mockReturnValue(
          createRect(scenario.cardLeft, scenario.cardTop, 1040, 300),
        );
        vi.spyOn(cell, 'getBoundingClientRect').mockReturnValue(
          createRect(scenario.cellLeft, scenario.cellTop, 13, 13),
        );

        cell.dispatchEvent(new FocusEvent('focus'));
        component.detectChanges();

        const tooltip = component.nativeElement.querySelector('[role="tooltip"]') as HTMLElement;
        const tooltipWidth = 180;
        const tooltipHeight = 42;
        vi.spyOn(tooltip, 'getBoundingClientRect').mockReturnValue(
          createRect(0, 0, tooltipWidth, tooltipHeight),
        );

        expect(positionCallback).toBeTruthy();
        positionCallback?.(0);
        component.detectChanges();

        const viewportLeft = Number.parseFloat(tooltip.style.left) + scenario.cardLeft;
        const viewportTop = Number.parseFloat(tooltip.style.top) + scenario.cardTop;

        expect(viewportLeft).toBeGreaterThanOrEqual(14);
        expect(viewportLeft + tooltipWidth).toBeLessThanOrEqual(scenario.viewportWidth - 14);
        expect(viewportTop).toBeGreaterThanOrEqual(14);
        expect(viewportTop + tooltipHeight).toBeLessThanOrEqual(scenario.viewportHeight - 14);
        expect(
          tooltip.classList.contains('github-tooltip--align-' + scenario.expectedAlignment),
        ).toBe(scenario.expectedAlignment !== 'center');
        expect(tooltip.classList.contains('github-tooltip--below')).toBe(
          scenario.expectedPlacement === 'below',
        );
      } finally {
        Object.defineProperty(window, 'innerWidth', {
          configurable: true,
          value: originalInnerWidth,
        });
        Object.defineProperty(window, 'innerHeight', {
          configurable: true,
          value: originalInnerHeight,
        });
      }
    },
  );
});
