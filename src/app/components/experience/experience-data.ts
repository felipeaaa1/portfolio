import { ProfessionalExperience } from './professional-experience';

export const PROFESSIONAL_EXPERIENCES: readonly ProfessionalExperience[] = [
  {
    id: 'txn-infox',
    role: 'Engenheiro de Software',
    company: 'TXN/Infox',
    startDate: '2025-02',
    startLabel: 'fevereiro de 2025',
    endLabel: 'presente',
    description: [
      'Manutenção e evolução do PJe, sistema judicial de grande porte.',
      'Atuação em aplicações legadas utilizando Java 8, JBoss Seam, JSF, RichFaces e Hibernate.',
      'Desenvolvimento e manutenção de interfaces Angular.',
      'Construção e evolução de fluxos de automação processual com JBPM e BPMN.',
      'Criação e revisão de migrations, consultas SQL e rotinas PostgreSQL.',
      'Investigação de falhas envolvendo frontend, backend, banco de dados e infraestrutura.',
      'Utilização de Maven, Git, Docker e WildFly no fluxo de desenvolvimento.',
      'Trabalho com automação de documentos, comunicações e processos judiciais.'
    ],
    technologies: [
      'Java', 'Java 8', 'JBoss Seam', 'JSF', 'RichFaces', 'Hibernate', 'Angular',
      'Angular 8', 'TypeScript', 'JBPM', 'BPMN', 'PostgreSQL', 'SQL', 'Maven',
      'Git', 'Docker', 'WildFly', 'XML'
    ]
  },
  {
    id: 'simplifica-gestao',
    role: 'Oracle APEX Developer',
    company: 'Simplifica Gestão',
    startDate: '2024-06',
    startLabel: 'junho de 2024',
    endDate: '2024-11',
    endLabel: 'novembro de 2024',
    description: [
      'Desenvolvimento de funcionalidades em Oracle APEX.',
      'Integração com WhatsApp.',
      'Implementação de controle de privilégios de usuários.',
      'Criação e manutenção de consultas Oracle SQL.',
      'Correção de falhas e otimização de funcionalidades.'
    ],
    technologies: ['Oracle APEX', 'Oracle SQL', 'PL/SQL', 'JavaScript', 'WhatsApp Integration', 'Low-code']
  },
  {
    id: 'hub85',
    role: 'Technology Lead',
    company: 'HUB85',
    startDate: '2023-09',
    startLabel: 'setembro de 2023',
    endDate: '2024-06',
    endLabel: 'junho de 2024',
    description: [
      'Liderança na criação de soluções de automação e integração.',
      'Desenvolvimento de fluxos com n8n e ManyChat.',
      'Integração de WhatsApp e Instagram com sistemas de CRM.',
      'Automação de processos de marketing e atendimento.',
      'Levantamento de requisitos.',
      'Coordenação de implementações técnicas.',
      'Orientação da equipe sobre boas práticas.'
    ],
    technologies: ['n8n', 'ManyChat', 'WhatsApp', 'Instagram', 'CRM', 'APIs', 'Automação', 'JavaScript', 'Low-code']
  },
  {
    id: 'hs-solutions',
    role: 'Full Stack Java Developer',
    company: 'HS Solutions',
    startDate: '2020-06',
    startLabel: 'junho de 2020',
    endDate: '2023-07',
    endLabel: 'julho de 2023',
    description: [
      'Manutenção e evolução de aplicações web corporativas.',
      'Desenvolvimento de APIs REST com Java.',
      'Desenvolvimento de interfaces com HTML, CSS, Backbone.js e jQuery.',
      'Integração com banco de dados usando MyBatis.',
      'Desenvolvimento e otimização de procedimentos PL/SQL.',
      'Geração de relatórios com JasperReports.',
      'Construção de consultas para integração com padrões nacionais de saúde.',
      'Experiência anterior de estágio na mesma organização, com foco em programação orientada a objetos.'
    ],
    technologies: [
      'Java', 'REST APIs', 'Oracle', 'PL/SQL', 'SQL', 'MyBatis', 'HTML', 'CSS',
      'JavaScript', 'Backbone.js', 'jQuery', 'JasperReports'
    ]
  },
  {
    id: 'gsh',
    role: 'QA Intern',
    company: 'GSH Gestão Hospitalar',
    startDate: '2017-11',
    startLabel: 'novembro de 2017',
    endDate: '2018-06',
    endLabel: 'junho de 2018',
    description: [
      'Execução de testes de software.',
      'Identificação e registro de falhas.',
      'Apoio na validação de correções.'
    ],
    technologies: ['Software Testing', 'Quality Assurance', 'Bug Tracking']
  }
];
