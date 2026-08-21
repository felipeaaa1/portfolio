export interface GithubContribution {
  date: string;
  count: number;
  level: number;
}

export interface GithubContributionsResponse {
  contributions: GithubContribution[];
}
