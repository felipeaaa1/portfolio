import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-about',
  imports: [RevealOnScrollDirective],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class About {
  protected readonly paragraphs: readonly string[] = [
  'Sou desenvolvedor de software com foco em Java e aplicações web. Tenho experiência na manutenção e evolução de sistemas corporativos, desenvolvimento de novas funcionalidades, automação de processos, integrações entre sistemas e bancos de dados relacionais. Ao longo da minha trajetória, atuei em diferentes segmentos, como saúde, CRM, automação de processos empresariais e, atualmente, no desenvolvimento de software para o setor judiciário.',

  'Fora do trabalho, gosto de praticar esportes e aproveitar atividades ao ar livre, especialmente corrida, ciclismo e conhecer lugares novos. Não costumo acompanhar séries ou filmes logo no lançamento, mas quando resolvo assistir algum tempo depois, geralmente acabo maratonando tudo de uma vez. Também sou apaixonado por música, principalmente rock clássico e alternativo, embora escute um pouco de tudo. Nas horas livres, gosto de assistir filmes com a minha mulher.',

  'Sou santista desde criança e acompanho o clube em todos os momentos, bons ou ruins. Também torço para o Pittsburgh Steelers, na NFL, e para o Miami Heat, na NBA.'
    ];
}
