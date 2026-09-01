  import type {
    GithubContribution,
    GithubContributionsResponse,
  } from './github-contribution';

  const GITHUB_CONTRIBUTIONS_API =
    'https://github-contributions-api.jogruber.de/v4';

  export async function loadGithubContributions(
    username: string,
    signal?: AbortSignal,
  ): Promise<readonly GithubContribution[]> {
    const account = username.trim().replace(/^@/, '');

    if (!account) {
      throw new Error('O nome da conta do GitHub é obrigatório.');
    }

    const response = await fetch(
      `${GITHUB_CONTRIBUTIONS_API}/${encodeURIComponent(account)}?y=last`,
      { signal },
    );

    if (!response.ok) {
      throw new Error(
        `Falha ao carregar contribuições: ${response.status}`,
      );
    }

    const data = (await response.json()) as GithubContributionsResponse;

    const today = new Date();
    const cutoff = new Date(
      Date.UTC(
        today.getUTCFullYear() - 1,
        today.getUTCMonth(),
        today.getUTCDate(),
      ),
    );

    return data.contributions
      .filter(
        ({ date }) =>
          new Date(`${date}T00:00:00Z`) >= cutoff,
      )
      .sort((first, second) =>
        first.date.localeCompare(second.date),
      );
  }