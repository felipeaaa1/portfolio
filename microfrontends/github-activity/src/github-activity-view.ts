import { formatContributionLabel } from './github-contribution-label';
import type { GithubContribution } from './github-contribution';
import { setupContributionTooltip } from './github-tooltip';

export interface GithubActivityView {
  root: HTMLElement;
  showLoading(): void;
  showSuccess(contributions: readonly GithubContribution[]): void;
  showError(): void;
  destroy(): void;
}

function findRequiredElement<T extends Element>(
  root: ParentNode,
  selector: string,
): T {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Elemento obrigatório não encontrado: ${selector}`);
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
  cell.className = `contribution-cell contribution-cell--level-${level}`;
  cell.tabIndex = 0;
  cell.dataset.date = contribution.date;
  cell.setAttribute('aria-label', formatContributionLabel(contribution));
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
    cell.className = `contribution-cell contribution-cell--level-${level}`;
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
      <p class="section__eyebrow">Código em movimento</p>
      <h2 id="github-title">Atividade no GitHub</h2>
      <p class="section__description">
        Contribuições públicas do último ano,
        atualizadas automaticamente.
      </p>
    </header>
    <article class="github-card" aria-busy="true">
      <div class="github-card__header">
        <a
          class="github-card__account"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M15 21v-3.5c.03-1-.35-1.96-1.05-2.66 3.1-.35 6.35-1.52 6.35-6.86a5.36 5.36 0 0 0-1.43-3.72A5 5 0 0 0 18.73.58S17.6.22 15 2a12.8 12.8 0 0 0-6 0C6.4.22 5.27.58 5.27.58a5 5 0 0 0-.14 3.68A5.36 5.36 0 0 0 3.7 8c0 5.33 3.25 6.5 6.35 6.86A3.63 3.63 0 0 0 9 17.5V21"
            ></path>
          </svg>
          <span class="github-card__account-name"></span>
        </a>
        <span class="github-card__total"></span>
      </div>
      <div class="github-card__content"></div>
    </article>
  `;

  const card = findRequiredElement<HTMLElement>(root, '.github-card');
  const accountLink = findRequiredElement<HTMLAnchorElement>(
    root,
    '.github-card__account',
  );
  const accountName = findRequiredElement<HTMLElement>(
    root,
    '.github-card__account-name',
  );
  const totalElement = findRequiredElement<HTMLElement>(
    root,
    '.github-card__total',
  );
  const content = findRequiredElement<HTMLElement>(
    root,
    '.github-card__content',
  );

  accountLink.href = `https://github.com/${encodeURIComponent(account)}`;
  accountName.textContent = `@${account}`;

  let disposeGraphInteractions: (() => void) | undefined;

  function clearGraphInteractions(): void {
    disposeGraphInteractions?.();
    disposeGraphInteractions = undefined;
  }

  function showLoading(): void {
    clearGraphInteractions();
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
    clearGraphInteractions();
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
    content.replaceChildren(graphRegion, createLegend());
    disposeGraphInteractions = setupContributionTooltip(card, scroll, graph);
  }

  function showError(): void {
    clearGraphInteractions();
    card.setAttribute('aria-busy', 'false');
    totalElement.textContent = '';

    const message = document.createElement('p');
    const profileLink = document.createElement('a');
    message.className = 'github-card__message';
    message.append('Não foi possível carregar as contribuições agora. ');
    profileLink.href = `https://github.com/${encodeURIComponent(account)}`;
    profileLink.target = '_blank';
    profileLink.rel = 'noopener noreferrer';
    profileLink.textContent = 'Ver perfil no GitHub';
    message.append(profileLink);
    content.replaceChildren(message);
  }

  function destroy(): void {
    clearGraphInteractions();
  }

  showLoading();
  return {
    root,
    showLoading,
    showSuccess,
    showError,
    destroy,
  };
}
