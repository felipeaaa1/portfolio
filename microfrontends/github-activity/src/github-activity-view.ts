  export interface GithubActivityView {
    root: HTMLElement;
    showLoading(): void;
    showSuccess(total: number): void;
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

    function showSuccess(total: number): void {
      card.setAttribute('aria-busy', 'false');
      totalElement.textContent = `${total} contribuições`;

      content.textContent =
        `@${account} — ${total} contribuições no último ano.`;
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