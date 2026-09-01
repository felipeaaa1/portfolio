import { formatContributionLabel } from './github-contribution-label';
import type { GithubContribution } from './github-contribution';

export interface GithubActivityView {
  root: HTMLElement;
  showLoading(): void;
  showSuccess(
    contributions: readonly GithubContribution[],
  ): void;
  showError(): void;
}

function findRequiredElement<T extends Element>(
  root: ParentNode,
  selector: string,
): T {
  const element = root.querySelector<T>(selector);

  if (!element) {
    throw new Error(
      `Elemento obrigatório não encontrado: ${selector}`,
    );
  }

  return element;
}

function normalizeLevel(level: number): number {
  return Math.min(4, Math.max(0, Math.trunc(level)));
}

function createContributionCell(
  contribution: GithubContribution,
): HTMLSpanElement {
  const cell = document.createElement('span');
  const level = normalizeLevel(contribution.level);

  cell.className =
    `contribution-cell contribution-cell--level-${level}`;

  cell.tabIndex = 0;
  cell.dataset.date = contribution.date;
  cell.setAttribute(
    'aria-label',
    formatContributionLabel(contribution),
  );

  return cell;
}

function createLegend(): HTMLElement {
  const legend = document.createElement('div');

  legend.className = 'github-card__legend';
  legend.setAttribute(
    'aria-label',
    'Legenda de intensidade das contribuições',
  );

  const less = document.createElement('span');
  less.textContent = 'Menos';
  legend.append(less);

  for (let level = 0; level <= 4; level += 1) {
    const cell = document.createElement('span');

    cell.className =
      `contribution-cell contribution-cell--level-${level}`;

    cell.setAttribute('aria-hidden', 'true');
    legend.append(cell);
  }

  const more = document.createElement('span');
  more.textContent = 'Mais';
  legend.append(more);

  return legend;
}

export function createGithubActivityView(
  account: string,
): GithubActivityView {
  const root = document.createElement('section');

  root.className = 'github-activity section';
  root.id = 'github';
  root.setAttribute('aria-labelledby', 'github-title');

  root.innerHTML = `
      <header class="section__header">
        <p class="section__eyebrow">
          Código em movimento
        </p>

        <h2 id="github-title">
          Atividade no GitHub
        </h2>

        <p class="section__description">
          Contribuições públicas do último ano,
          atualizadas automaticamente.
        </p>
      </header>

      <article
        class="github-card"
        aria-busy="true"
      >
        <div class="github-card__header">
          <a
            class="github-card__account"
            target="_blank"
            rel="noopener noreferrer"
          ></a>

          <span class="github-card__total"></span>
        </div>

        <div class="github-card__content"></div>
      </article>
    `;

  const card = findRequiredElement<HTMLElement>(
    root,
    '.github-card',
  );

  const accountLink = findRequiredElement<HTMLAnchorElement>(
    root,
    '.github-card__account',
  );

  const totalElement = findRequiredElement<HTMLElement>(
    root,
    '.github-card__total',
  );

  const content = findRequiredElement<HTMLElement>(
    root,
    '.github-card__content',
  );

  accountLink.href =
    `https://github.com/${encodeURIComponent(account)}`;

  accountLink.textContent = `@${account}`;

  function showLoading(): void {
    card.setAttribute('aria-busy', 'true');
    totalElement.textContent = '';

    content.innerHTML = `
        <div
          class="github-card__skeleton"
          aria-label="Carregando contribuições"
        ></div>
      `;
  }

  function showSuccess(
    contributions: readonly GithubContribution[],
  ): void {
    const total = contributions.reduce(
      (sum, contribution) => sum + contribution.count,
      0,
    );

    const graphRegion = document.createElement('div');
    const scroll = document.createElement('div');
    const graph = document.createElement('div');

    graphRegion.className = 'github-card__graph-region';

    scroll.className = 'github-card__scroll';
    scroll.tabIndex = 0;
    scroll.setAttribute(
      'aria-label',
      'Gráfico de contribuições do último ano; role horizontalmente para explorar',
    );

    graph.className = 'github-card__graph';

    for (const contribution of contributions) {
      graph.append(createContributionCell(contribution));
    }

    scroll.append(graph);
    graphRegion.append(scroll);

    card.setAttribute('aria-busy', 'false');
    totalElement.textContent = `${total} contribuições`;

    content.replaceChildren(
      graphRegion,
      createLegend(),
    );
  }

  function showError(): void {
    card.setAttribute('aria-busy', 'false');
    totalElement.textContent = '';

    const message = document.createElement('p');
    const profileLink = document.createElement('a');

    message.className = 'github-card__message';

    message.append(
      'Não foi possível carregar as contribuições agora. ',
    );

    profileLink.href =
      `https://github.com/${encodeURIComponent(account)}`;

    profileLink.target = '_blank';
    profileLink.rel = 'noopener noreferrer';
    profileLink.textContent = 'Ver perfil no GitHub';

    message.append(profileLink);
    content.replaceChildren(message);
  }

  showLoading();

  return {
    root,
    showLoading,
    showSuccess,
    showError,
  };
}