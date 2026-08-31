  export interface GithubActivityOptions {
    username: string;
  }

  export interface GithubActivityRemote {
    mount(
      container: HTMLElement,
      options: GithubActivityOptions
    ): () => void;
  }