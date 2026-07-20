import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { PROFESSIONAL_EXPERIENCES } from './experience-data';

@Component({
  selector: 'app-experience',
  imports: [RevealOnScrollDirective],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Experience {
  protected readonly experiences = PROFESSIONAL_EXPERIENCES;
}
