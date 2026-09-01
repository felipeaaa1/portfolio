import { afterEach, describe, expect, it, vi } from 'vitest';

import { loadGithubContributions } from './github-contributions-client';

describe('loadGithubContributions', () => {
    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it('requests the last year for the normalized account', async () => {
        const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
            new Response(
                JSON.stringify({
                    contributions: [],
                }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            ),
        );

        vi.stubGlobal('fetch', fetchMock);

        const signal = new AbortController().signal;

        await loadGithubContributions('  @felipeaaa1  ', signal);

        expect(fetchMock).toHaveBeenCalledWith(
            'https://github-contributions-api.jogruber.de/v4/felipeaaa1?y=last',
            { signal },
        );
    });

    it('keeps only the last year and sorts contributions by date', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-08-30T12:00:00Z'));

        vi.stubGlobal(
            'fetch',
            vi.fn<typeof fetch>().mockResolvedValue(
                new Response(
                    JSON.stringify({
                        contributions: [
                            {
                                date: '2026-08-30',
                                count: 4,
                                level: 2,
                            },
                            {
                                date: '2025-08-29',
                                count: 8,
                                level: 4,
                            },
                            {
                                date: '2025-08-30',
                                count: 1,
                                level: 1,
                            },
                        ],
                    }),
                    { status: 200 },
                ),
            ),
        );

        const result = await loadGithubContributions('felipeaaa1');

        expect(result).toEqual([
            {
                date: '2025-08-30',
                count: 1,
                level: 1,
            },
            {
                date: '2026-08-30',
                count: 4,
                level: 2,
            },
        ]);
    });

    it('rejects an empty account without making a request', async () => {
        const fetchMock = vi.fn<typeof fetch>();

        vi.stubGlobal('fetch', fetchMock);

        await expect(
            loadGithubContributions('   '),
        ).rejects.toThrow(
            'O nome da conta do GitHub é obrigatório.',
        );

        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('reports the HTTP status when the API fails', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn<typeof fetch>().mockResolvedValue(
                new Response(null, { status: 503 }),
            ),
        );

        await expect(
            loadGithubContributions('felipeaaa1'),
        ).rejects.toThrow(
            'Falha ao carregar contribuições: 503',
        );
    });
});