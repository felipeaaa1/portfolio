import { describe, expect, it } from 'vitest';

import { formatContributionLabel } from './github-contribution-label';

describe('formatContributionLabel', () => {
    it('formats a single contribution in Portuguese', () => {
        expect(
            formatContributionLabel({
                date: '2026-08-30',
                count: 1,
                level: 1,
            }),
        ).toBe(
            '1 contribuição em 30 de agosto de 2026',
        );
    });

    it('formats multiple contributions in Portuguese', () => {
        expect(
            formatContributionLabel({
                date: '2026-08-30',
                count: 4,
                level: 2,
            }),
        ).toBe(
            '4 contribuições em 30 de agosto de 2026',
        );
    });
});