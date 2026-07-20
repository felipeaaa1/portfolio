import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { Certification } from './certification';

@Component({
  selector: 'app-certifications',
  imports: [RevealOnScrollDirective],
  templateUrl: './certifications.html',
  styleUrl: './certifications.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Certifications {
  protected readonly certifications: readonly Certification[] = [
    {
      id: 'english-proficiency',
      title: 'Certificado de proficiência em inglês',
      issuer: 'Núcleo de Línguas da UECE'
    },
    {
      id: 'object-oriented-programming',
      title: 'Minicurso de Programação Orientada a Objetos',
      issuer: 'PET Computação, UECE'
    }
  ];
}
