import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { GithubContribution, GithubContributionsResponse } from './github-contribution';

interface TooltipPosition {
  horizontal: 'center' | 'left' | 'right';
  left: number;
  placement: 'above' | 'below';
  top: number;
}

@Component({
  selector: 'app-github-activity',
  imports: [RevealOnScrollDirective],
  templateUrl: './github-activity.html',
  styleUrl: './github-activity.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GithubActivity implements OnInit, OnDestroy {
  protected readonly account = 'felipeaaa1';
  protected readonly contributions = signal<readonly GithubContribution[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly activeContribution = signal<GithubContribution | null>(null);
  protected readonly tooltipPosition = signal<TooltipPosition>({
    horizontal: 'center',
    left: 0,
    placement: 'above',
    top: 0,
  });
  protected readonly totalContributions = computed(() =>
    this.contributions().reduce((total, day) => total + day.count, 0),
  );

  private readonly platformId = inject(PLATFORM_ID);
  private readonly card = viewChild<ElementRef<HTMLElement>>('card');
  private readonly tooltip = viewChild<ElementRef<HTMLElement>>('tooltip');
  private readonly abortController = new AbortController();
  private activeCell?: HTMLElement;
  private closeTimer?: number;
  private positionFrame?: number;
  private cellFocused = false;
  private cellHovered = false;
  private tooltipHovered = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    void this.loadContributions();
  }

  ngOnDestroy(): void {
    this.abortController.abort();
    this.cancelScheduledClose();

    if (this.positionFrame !== undefined) {
      cancelAnimationFrame(this.positionFrame);
    }
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  protected repositionTooltip(): void {
    if (!this.activeContribution() || !this.activeCell) {
      return;
    }

    this.schedulePosition();
  }

  protected contributionLabel(contribution: GithubContribution): string {
    const date = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(contribution.date + 'T00:00:00Z'));
    const amount =
      contribution.count === 1 ? '1 contribuição' : contribution.count + ' contribuições';

    return amount + ' em ' + date;
  }

  protected isTooltipActive(contribution: GithubContribution): boolean {
    return this.activeContribution()?.date === contribution.date;
  }

  protected showFromMouse(contribution: GithubContribution, event: MouseEvent): void {
    this.cellHovered = true;
    this.openTooltip(contribution, event.currentTarget as HTMLElement);
  }

  protected showFromFocus(contribution: GithubContribution, event: FocusEvent): void {
    this.cellFocused = true;
    this.openTooltip(contribution, event.currentTarget as HTMLElement);
  }

  protected leaveCell(): void {
    this.cellHovered = false;
    this.scheduleClose();
  }

  protected blurCell(): void {
    this.cellFocused = false;
    this.scheduleClose();
  }

  protected enterTooltip(): void {
    this.tooltipHovered = true;
    this.cancelScheduledClose();
  }

  protected leaveTooltip(): void {
    this.tooltipHovered = false;
    this.scheduleClose();
  }

  protected closeWithEscape(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.closeTooltip();
  }

  private openTooltip(contribution: GithubContribution, cell: HTMLElement): void {
    this.cancelScheduledClose();
    this.activeCell = cell;
    this.activeContribution.set(contribution);
    this.schedulePosition();
  }

  private schedulePosition(): void {
    if (this.positionFrame !== undefined) {
      cancelAnimationFrame(this.positionFrame);
    }

    this.positionFrame = requestAnimationFrame(() => {
      this.positionFrame = undefined;
      this.positionActiveTooltip();
    });
  }

  private positionActiveTooltip(): void {
    const card = this.card()?.nativeElement;
    const tooltip = this.tooltip()?.nativeElement;

    if (!card || !tooltip || !this.activeCell) {
      return;
    }

    const cardRect = card.getBoundingClientRect();
    const cellRect = this.activeCell.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportMargin = 14;
    const safeGap = 10;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const horizontalEdgeZone = tooltipRect.width * 0.75 + viewportMargin;

    let horizontal: TooltipPosition['horizontal'] = 'center';
    let viewportLeft = cellRect.left + cellRect.width / 2 - tooltipRect.width / 2;

    if (cellRect.left < horizontalEdgeZone) {
      horizontal = 'left';
      viewportLeft = cellRect.left;
    } else if (cellRect.right > viewportWidth - horizontalEdgeZone) {
      horizontal = 'right';
      viewportLeft = cellRect.right - tooltipRect.width;
    }

    const maximumViewportLeft = Math.max(
      viewportMargin,
      viewportWidth - tooltipRect.width - viewportMargin,
    );
    viewportLeft = Math.min(Math.max(viewportLeft, viewportMargin), maximumViewportLeft);

    const topAbove = cellRect.top - tooltipRect.height - safeGap;
    const placement: TooltipPosition['placement'] = topAbove >= viewportMargin ? 'above' : 'below';
    let viewportTop = placement === 'above' ? topAbove : cellRect.bottom + safeGap;

    const maximumViewportTop = Math.max(
      viewportMargin,
      viewportHeight - tooltipRect.height - viewportMargin,
    );
    viewportTop = Math.min(Math.max(viewportTop, viewportMargin), maximumViewportTop);

    this.tooltipPosition.set({
      horizontal,
      left: viewportLeft - cardRect.left,
      placement,
      top: viewportTop - cardRect.top,
    });
  }

  private scheduleClose(): void {
    this.cancelScheduledClose();
    this.closeTimer = window.setTimeout(() => {
      if (!this.cellHovered && !this.cellFocused && !this.tooltipHovered) {
        this.closeTooltip();
      }
    }, 180);
  }

  private cancelScheduledClose(): void {
    if (this.closeTimer !== undefined) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
  }

  private closeTooltip(): void {
    this.cancelScheduledClose();
    this.activeContribution.set(null);
    this.activeCell = undefined;
    this.cellHovered = false;
    this.cellFocused = false;
    this.tooltipHovered = false;
  }

  private async loadContributions(): Promise<void> {
    try {
      const response = await fetch(
        'https://github-contributions-api.jogruber.de/v4/' + this.account + '?y=last',
        { signal: this.abortController.signal },
      );

      if (!response.ok) {
        throw new Error('Falha ao carregar contribuições: ' + response.status);
      }

      const data = (await response.json()) as GithubContributionsResponse;
      const today = new Date();
      const cutoff = new Date(
        Date.UTC(today.getUTCFullYear() - 1, today.getUTCMonth(), today.getUTCDate()),
      );

      this.contributions.set(
        data.contributions
          .filter(({ date }) => new Date(date + 'T00:00:00Z') >= cutoff)
          .sort((first, second) => first.date.localeCompare(second.date)),
      );
    } catch (error: unknown) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        this.error.set(true);
      }
    } finally {
      this.loading.set(false);
    }
  }
}
