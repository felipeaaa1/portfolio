const TOOLTIP_ID = 'github-contribution-tooltip';
const VIEWPORT_MARGIN = 14;
const SAFE_GAP = 10;
const CLOSE_DELAY = 180;

function contributionCellFrom(target: EventTarget | null): HTMLElement | null {
  return target instanceof HTMLElement && target.classList.contains('contribution-cell')
    ? target
    : null;
}

export function setupContributionTooltip(
  card: HTMLElement,
  scroll: HTMLElement,
  graph: HTMLElement,
): () => void {
  let activeCell: HTMLElement | undefined;
  let tooltip: HTMLElement | undefined;
  let closeTimer: number | undefined;
  let positionFrame: number | undefined;
  let cellFocused = false;
  let cellHovered = false;
  let tooltipHovered = false;

  function cancelScheduledClose(): void {
    if (closeTimer !== undefined) {
      window.clearTimeout(closeTimer);
      closeTimer = undefined;
    }
  }

  function closeTooltip(): void {
    cancelScheduledClose();
    activeCell?.removeAttribute('aria-describedby');
    tooltip?.remove();
    tooltip = undefined;
    activeCell = undefined;
    cellFocused = false;
    cellHovered = false;
    tooltipHovered = false;
  }

  function scheduleClose(): void {
    cancelScheduledClose();
    closeTimer = window.setTimeout(() => {
      if (!cellHovered && !cellFocused && !tooltipHovered) {
        closeTooltip();
      }
    }, CLOSE_DELAY);
  }

  function positionTooltip(): void {
    if (!tooltip || !activeCell) {
      return;
    }

    const cardRect = card.getBoundingClientRect();
    const cellRect = activeCell.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const horizontalEdgeZone = tooltipRect.width * 0.75 + VIEWPORT_MARGIN;

    let horizontal: 'center' | 'left' | 'right' = 'center';
    let viewportLeft = cellRect.left + cellRect.width / 2 - tooltipRect.width / 2;

    if (cellRect.left < horizontalEdgeZone) {
      horizontal = 'left';
      viewportLeft = cellRect.left;
    } else if (cellRect.right > viewportWidth - horizontalEdgeZone) {
      horizontal = 'right';
      viewportLeft = cellRect.right - tooltipRect.width;
    }

    const maximumLeft = Math.max(
      VIEWPORT_MARGIN,
      viewportWidth - tooltipRect.width - VIEWPORT_MARGIN,
    );
    viewportLeft = Math.min(Math.max(viewportLeft, VIEWPORT_MARGIN), maximumLeft);

    const topAbove = cellRect.top - tooltipRect.height - SAFE_GAP;
    const placement = topAbove >= VIEWPORT_MARGIN ? 'above' : 'below';
    let viewportTop = placement === 'above' ? topAbove : cellRect.bottom + SAFE_GAP;
    const maximumTop = Math.max(
      VIEWPORT_MARGIN,
      viewportHeight - tooltipRect.height - VIEWPORT_MARGIN,
    );
    viewportTop = Math.min(Math.max(viewportTop, VIEWPORT_MARGIN), maximumTop);

    tooltip.classList.toggle('github-tooltip--below', placement === 'below');
    tooltip.classList.toggle('github-tooltip--align-left', horizontal === 'left');
    tooltip.classList.toggle('github-tooltip--align-right', horizontal === 'right');
    tooltip.style.left = `${viewportLeft - cardRect.left}px`;
    tooltip.style.top = `${viewportTop - cardRect.top}px`;
  }

  function schedulePosition(): void {
    if (!tooltip || !activeCell) {
      return;
    }

    if (positionFrame !== undefined) {
      cancelAnimationFrame(positionFrame);
    }

    positionFrame = requestAnimationFrame(() => {
      positionFrame = undefined;
      positionTooltip();
    });
  }

  function openTooltip(cell: HTMLElement): void {
    cancelScheduledClose();

    if (activeCell !== cell) {
      activeCell?.removeAttribute('aria-describedby');
    }

    activeCell = cell;

    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = TOOLTIP_ID;
      tooltip.className = 'github-tooltip';
      tooltip.setAttribute('role', 'tooltip');
      tooltip.addEventListener('mouseenter', onTooltipEnter);
      tooltip.addEventListener('mouseleave', onTooltipLeave);
      tooltip.addEventListener('keydown', onEscape);
      card.append(tooltip);
    }

    tooltip.textContent = cell.getAttribute('aria-label') ?? '';
    cell.setAttribute('aria-describedby', TOOLTIP_ID);
    schedulePosition();
  }

  function onMouseOver(event: MouseEvent): void {
    const cell = contributionCellFrom(event.target);
    if (!cell || cell.contains(event.relatedTarget as Node | null)) return;
    cellHovered = true;
    openTooltip(cell);
  }

  function onMouseOut(event: MouseEvent): void {
    const cell = contributionCellFrom(event.target);
    if (!cell || cell.contains(event.relatedTarget as Node | null)) return;
    cellHovered = false;
    scheduleClose();
  }

  function onFocusIn(event: FocusEvent): void {
    const cell = contributionCellFrom(event.target);
    if (!cell) return;
    cellFocused = true;
    openTooltip(cell);
  }

  function onFocusOut(event: FocusEvent): void {
    const cell = contributionCellFrom(event.target);
    if (!cell) return;
    cellFocused = false;
    scheduleClose();
  }

  function onTooltipEnter(): void {
    tooltipHovered = true;
    cancelScheduledClose();
  }

  function onTooltipLeave(): void {
    tooltipHovered = false;
    scheduleClose();
  }

  function onEscape(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || (!tooltip && !activeCell)) return;
    event.preventDefault();
    event.stopPropagation();
    closeTooltip();
  }

  function onViewportChange(): void {
    schedulePosition();
  }

  graph.addEventListener('mouseover', onMouseOver);
  graph.addEventListener('mouseout', onMouseOut);
  graph.addEventListener('focusin', onFocusIn);
  graph.addEventListener('focusout', onFocusOut);
  graph.addEventListener('keydown', onEscape);
  scroll.addEventListener('scroll', onViewportChange);
  window.addEventListener('resize', onViewportChange);
  window.addEventListener('scroll', onViewportChange);

  return () => {
    graph.removeEventListener('mouseover', onMouseOver);
    graph.removeEventListener('mouseout', onMouseOut);
    graph.removeEventListener('focusin', onFocusIn);
    graph.removeEventListener('focusout', onFocusOut);
    graph.removeEventListener('keydown', onEscape);
    scroll.removeEventListener('scroll', onViewportChange);
    window.removeEventListener('resize', onViewportChange);
    window.removeEventListener('scroll', onViewportChange);
    cancelScheduledClose();

    if (positionFrame !== undefined) {
      cancelAnimationFrame(positionFrame);
      positionFrame = undefined;
    }

    closeTooltip();
  };
}
