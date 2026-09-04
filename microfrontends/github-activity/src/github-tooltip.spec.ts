// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { setupContributionTooltip } from './github-tooltip';

interface PositionScenario {
  cellLeft: number;
  cellTop: number;
  expectedAlignment: 'center' | 'left' | 'right';
  expectedPlacement: 'above' | 'below';
  name: string;
  viewportHeight: number;
  viewportWidth: number;
}

function createRect(
  left: number,
  top: number,
  width: number,
  height: number,
): DOMRect {
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

function createFixture(): {
  card: HTMLElement;
  cell: HTMLElement;
  graph: HTMLElement;
  scroll: HTMLElement;
} {
  const card = document.createElement('article');
  const scroll = document.createElement('div');
  const graph = document.createElement('div');
  const cell = document.createElement('span');

  cell.className = 'contribution-cell contribution-cell--level-2';
  cell.tabIndex = 0;
  cell.setAttribute('aria-label', '3 contribuições em 30 de agosto de 2026');
  graph.append(cell);
  scroll.append(graph);
  card.append(scroll);
  document.body.append(card);

  return { card, cell, graph, scroll };
}

const positionScenarios: PositionScenario[] = [
  {
    name: 'first column',
    viewportWidth: 1200,
    viewportHeight: 800,
    cellLeft: 85,
    cellTop: 500,
    expectedAlignment: 'left',
    expectedPlacement: 'above',
  },
  {
    name: 'central column',
    viewportWidth: 1200,
    viewportHeight: 800,
    cellLeft: 600,
    cellTop: 500,
    expectedAlignment: 'center',
    expectedPlacement: 'above',
  },
  {
    name: 'penultimate column',
    viewportWidth: 1200,
    viewportHeight: 800,
    cellLeft: 1065,
    cellTop: 500,
    expectedAlignment: 'right',
    expectedPlacement: 'above',
  },
  {
    name: 'last column',
    viewportWidth: 1200,
    viewportHeight: 800,
    cellLeft: 1105,
    cellTop: 500,
    expectedAlignment: 'right',
    expectedPlacement: 'above',
  },
  {
    name: 'top cell',
    viewportWidth: 1200,
    viewportHeight: 800,
    cellLeft: 600,
    cellTop: 8,
    expectedAlignment: 'center',
    expectedPlacement: 'below',
  },
  {
    name: 'bottom cell on a scrolled page',
    viewportWidth: 1200,
    viewportHeight: 800,
    cellLeft: 600,
    cellTop: 760,
    expectedAlignment: 'center',
    expectedPlacement: 'above',
  },
  {
    name: 'last column on mobile',
    viewportWidth: 360,
    viewportHeight: 640,
    cellLeft: 334,
    cellTop: 320,
    expectedAlignment: 'right',
    expectedPlacement: 'above',
  },
];

describe('setupContributionTooltip', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      }),
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    document.body.replaceChildren();
  });

  it('shows an accessible tooltip on focus and closes it with Escape', () => {
    const { card, cell, graph, scroll } = createFixture();
    const cleanup = setupContributionTooltip(card, scroll, graph);

    cell.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

    const tooltip = card.querySelector('[role="tooltip"]');
    expect(tooltip?.textContent).toContain('3 contribuições');
    expect(cell.getAttribute('aria-describedby')).toBe(
      'github-contribution-tooltip',
    );

    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );

    expect(card.querySelector('[role="tooltip"]')).toBeNull();
    expect(cell.hasAttribute('aria-describedby')).toBe(false);
    cleanup();
  });

  it('keeps the tooltip open while the pointer moves onto it', () => {
    vi.useFakeTimers();
    const { card, cell, graph, scroll } = createFixture();
    const cleanup = setupContributionTooltip(card, scroll, graph);

    cell.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    const tooltip = card.querySelector('[role="tooltip"]') as HTMLElement;
    cell.dispatchEvent(
      new MouseEvent('mouseout', { bubbles: true, relatedTarget: tooltip }),
    );
    tooltip.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(200);

    expect(card.querySelector('[role="tooltip"]')).toBe(tooltip);

    tooltip.dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(200);
    expect(card.querySelector('[role="tooltip"]')).toBeNull();
    cleanup();
  });

  it.each(positionScenarios)(
    'keeps the tooltip inside the viewport for $name',
    (scenario) => {
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
          return 7;
        }),
      );

      const { card, cell, graph, scroll } = createFixture();
      vi.spyOn(card, 'getBoundingClientRect').mockReturnValue(
        createRect(80, 240, 1040, 300),
      );
      vi.spyOn(cell, 'getBoundingClientRect').mockReturnValue(
        createRect(scenario.cellLeft, scenario.cellTop, 13, 13),
      );
      const cleanup = setupContributionTooltip(card, scroll, graph);

      cell.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      const tooltip = card.querySelector('[role="tooltip"]') as HTMLElement;
      vi.spyOn(tooltip, 'getBoundingClientRect').mockReturnValue(
        createRect(0, 0, 180, 42),
      );
      positionCallback?.(0);

      const viewportLeft = Number.parseFloat(tooltip.style.left) + 80;
      const viewportTop = Number.parseFloat(tooltip.style.top) + 240;
      expect(viewportLeft).toBeGreaterThanOrEqual(14);
      expect(viewportLeft + 180).toBeLessThanOrEqual(
        scenario.viewportWidth - 14,
      );
      expect(viewportTop).toBeGreaterThanOrEqual(14);
      expect(viewportTop + 42).toBeLessThanOrEqual(
        scenario.viewportHeight - 14,
      );
      expect(
        tooltip.classList.contains(
          `github-tooltip--align-${scenario.expectedAlignment}`,
        ),
      ).toBe(scenario.expectedAlignment !== 'center');
      expect(tooltip.classList.contains('github-tooltip--below')).toBe(
        scenario.expectedPlacement === 'below',
      );
      cleanup();
    },
  );

  it('cancels pending work and removes the tooltip on cleanup', () => {
    let positionCallback: FrameRequestCallback | undefined;
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        positionCallback = callback;
        return 23;
      }),
    );
    const { card, cell, graph, scroll } = createFixture();
    const cleanup = setupContributionTooltip(card, scroll, graph);

    cell.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(positionCallback).toBeTruthy();
    cleanup();

    expect(cancelAnimationFrame).toHaveBeenCalledWith(23);
    expect(card.querySelector('[role="tooltip"]')).toBeNull();
    expect(cell.hasAttribute('aria-describedby')).toBe(false);
  });
});
