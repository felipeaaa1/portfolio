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

      expect(container.textContent).toContain(
        'Carregando contribuições...',
      );

      expect(
        container.querySelector('.github-activity'),
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

      await vi.waitFor(() => {
        expect(container.textContent).toContain(
          '@felipeaaa1 — 5 contribuições no último ano.',
        );
      });

      expect(
        container
          .querySelector('.github-activity')
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

      await vi.waitFor(() => {
        expect(container.textContent).toContain(
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

      const signal = loadContributionsMock.mock.calls[0]?.[1];

      expect(signal?.aborted).toBe(false);
      expect(container.children).toHaveLength(1);

      unmount();

      expect(signal?.aborted).toBe(true);
      expect(container.children).toHaveLength(0);
    });
  });