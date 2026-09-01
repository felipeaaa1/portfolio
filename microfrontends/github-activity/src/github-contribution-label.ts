import type { GithubContribution } from './github-contribution';

export function formatContributionLabel(
    contribution: GithubContribution,
): string {
    const date = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(
        new Date(`${contribution.date}T00:00:00Z`),
    );

    const amount =
        contribution.count === 1
            ? '1 contribuição'
            : `${contribution.count} contribuições`;

    return `${amount} em ${date}`;
}  