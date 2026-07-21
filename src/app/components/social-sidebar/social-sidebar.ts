import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import { SocialLink } from './social-link';

@Component({
  selector: 'app-social-sidebar',
  imports: [],
  templateUrl: './social-sidebar.html',
  styleUrl: './social-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialSidebar {
  protected readonly socialLinks: readonly SocialLink[] = [
    {
      id: 'linkedin',
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/felipe-alves-3223191bb',
      ariaLabel: 'Acessar o LinkedIn de Felipe Arnaud'
    },
    {
      id: 'github',
      label: 'GitHub',
      url: 'https://github.com/felipeaaa1',
      ariaLabel: 'Acessar o GitHub de Felipe Arnaud'
    },
    {
      id: 'instagram',
      label: 'Instagram',
      url: 'https://www.instagram.com/arnaud_felipe/',
      ariaLabel: 'Acessar o Instagram de Felipe Arnaud'
    }
  ];
}
