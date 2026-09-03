import { createGithubActivityView } from './github-activity-view';
import type { GithubActivityOptions } from './contract';
import { loadGithubContributions } from './github-contributions-client';

export function mount(
  container: HTMLElement,
  options: GithubActivityOptions,
): () => void {
  const abortController = new AbortController();
  const account = options.username.trim().replace(/^@/, '');

  const view = createGithubActivityView(account);
  const host = document.createElement('div');

  host.className = 'github-activity-host';

  const shadowRoot = host.attachShadow({
    mode: 'open',
  });

  shadowRoot.append(view.root);

  container.replaceChildren(host);

  void loadGithubContributions(
    account,
    abortController.signal,
  )
    .then((contributions) => {
      if (abortController.signal.aborted) {
        return;
      }

      view.showSuccess(contributions);
    })
    .catch((error: unknown) => {
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        return;
      }

      view.showError();
    });

  return () => {
    abortController.abort();
    container.replaceChildren();
  };
}