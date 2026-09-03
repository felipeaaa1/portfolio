// @vitest-environment jsdom

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { loadGithubContributions } from './github-contributions-client';
import { mount } from './mount';

vi.mock('./github-contributions-client', () => ({
  loadGithubContributions: vi.fn(),
}));

const loadContributionsMock = vi.mocked(
  loadGithubContributions,
);

function getShadowRoot(
  container: HTMLElement,
): ShadowRoot {
  const shadowRoot = container.firstElementChild?.shadowRoot;

  if (!shadowRoot) {
    throw new Error(
      'Shadow root do GitHub Activity não encontrado.',
    );
  }

  return shadowRoot;
}

describe('mount', () => {
  beforeEach(() => {
    loadContributionsMock.mockReset();
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it('renders the loading state and starts the request', () => {
    loadContributionsMock.mockReturnValue(
      new Promise<never>(() => undefined),
    );

    const container = document.createElement('div');

    const unmount = mount(container, {
      username: 'felipeaaa1',
    });

    const shadowRoot = getShadowRoot(container);

    expect(
      shadowRoot.querySelector(
        '[aria-label="Carregando contribuições"]',
      ),
    ).not.toBeNull();

    expect(
      shadowRoot.querySelector('.github-activity'),
    ).not.toBeNull();

    expect(loadContributionsMock).toHaveBeenCalledWith(
      'felipeaaa1',
      expect.any(AbortSignal),
    );

    unmount();
  });

  it('renders the total after loading contributions', async () => {
    loadContributionsMock.mockResolvedValue([
      {
        date: '2026-08-29',
        count: 2,
        level: 1,
      },
      {
        date: '2026-08-30',
        count: 3,
        level: 2,
      },
    ]);

    const container = document.createElement('div');

    const unmount = mount(container, {
      username: '@felipeaaa1',
    });

    const shadowRoot = getShadowRoot(container);

    await vi.waitFor(() => {
      expect(
        shadowRoot.querySelector('.github-card__total')
          ?.textContent,
      ).toBe('5 contribuições');

      expect(
        shadowRoot.querySelectorAll(
          '.github-card__graph .contribution-cell',
        ),
      ).toHaveLength(2);
    });


    expect(
      shadowRoot
        .querySelector('.github-card')
        ?.getAttribute('aria-busy'),
    ).toBe('false');

    unmount();
  });

  it('renders an error message when loading fails', async () => {
    loadContributionsMock.mockRejectedValue(
      new Error('API indisponível'),
    );

    const container = document.createElement('div');

    const unmount = mount(container, {
      username: 'felipeaaa1',
    });

    const shadowRoot = getShadowRoot(container);

    await vi.waitFor(() => {
      expect(shadowRoot.textContent).toContain(
        'Não foi possível carregar as contribuições agora.',
      );
    });

    unmount();
  });

  it('removes the content and aborts the request on unmount', () => {
    loadContributionsMock.mockReturnValue(
      new Promise<never>(() => undefined),
    );

    const container = document.createElement('div');

    const unmount = mount(container, {
      username: 'felipeaaa1',
    });

    const shadowRoot = getShadowRoot(container);

    const signal = loadContributionsMock.mock.calls[0]?.[1];

    expect(signal?.aborted).toBe(false);
    expect(container.children).toHaveLength(1);

    unmount();

    expect(signal?.aborted).toBe(true);
    expect(container.children).toHaveLength(0);
  });
});