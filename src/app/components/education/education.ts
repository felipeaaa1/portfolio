import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { EducationItem } from './education-item';

@Component({
  selector: 'app-education',
  imports: [RevealOnScrollDirective],
  templateUrl: './education.html',
  styleUrl: './education.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Education {
  protected readonly education: readonly EducationItem[] = [
    {
      id: 'mba-software-engineering',
      degree: 'MBA em Engenharia de Software',
      institution: 'Universidade de São Paulo — Escola Superior de Agricultura Luiz de Queiroz',
      institutionShortName: 'USP/ESALQ',
      startYear: '2026',
      endYear: '2028',
      status: 'Em andamento',
      details: 'Pós-graduação lato sensu'
    },
    {
      id: 'computer-science',
      degree: 'Bacharelado em Ciência da Computação',
      institution: 'Universidade Estadual do Ceará',
      institutionShortName: 'UECE',
      startYear: '2014',
      endYear: '2023'
    }
  ];
}
