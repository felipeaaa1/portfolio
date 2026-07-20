import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { SKILL_CATEGORIES } from './skills-data';

@Component({
  selector: 'app-skills',
  imports: [RevealOnScrollDirective],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Skills {
  protected readonly categories = SKILL_CATEGORIES;
}
