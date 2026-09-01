import type { GithubActivityOptions } from './contract';
import { loadGithubContributions } from './github-contributions-client';

export function mount(
    container: HTMLElement,
    options: GithubActivityOptions,
): () => void {
    const abortController = new AbortController();
    const account = options.username.trim().replace(/^@/, '');

    const root = document.createElement('section');

    root.className = 'github-activity';
    root.setAttribute('aria-busy', 'true');
    root.textContent = 'Carregando contribuições...';

    container.append(root);

    void loadGithubContributions(
        account,
        abortController.signal,
    )
        .then((contributions) => {
            if (abortController.signal.aborted) {
                return;
            }

            const total = contributions.reduce(
                (sum, contribution) => sum + contribution.count,
                0,
            );

            root.setAttribute('aria-busy', 'false');
            root.textContent =
                `@${account} — ${total} contribuições no último ano.`;
        })
        .catch((error: unknown) => {
            if (
                error instanceof DOMException &&
                error.name === 'AbortError'
            ) {
                return;
            }

            root.setAttribute('aria-busy', 'false');
            root.textContent =
                'Não foi possível carregar as contribuições agora.';
        });

    return () => {
        abortController.abort();
        root.remove();
    };
}