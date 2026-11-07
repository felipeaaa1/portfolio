import { SkillCategory } from './skill-category';

export const SKILL_CATEGORIES: readonly SkillCategory[] = [
  {
    id: 'backend',
    title: 'Backend',
    skills: [
      'Java', 'Spring Boot', 'Microsserviços', 'Arquitetura Hexagonal', 'REST APIs',
      'OpenAPI', 'Mensageria', 'JBoss Seam', 'Hibernate', 'MyBatis'
    ]
  },
  {
    id: 'frontend',
    title: 'Frontend',
    skills: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'SCSS', 'React', 'Vue.js', 'Backbone.js', 'jQuery']
  },
  {
    id: 'databases',
    title: 'Bancos de dados',
    skills: ['NoSQL', 'PostgreSQL', 'Oracle', 'SQL', 'PL/SQL', 'H2']
  },
  {
    id: 'automated-testing',
    title: 'Testes automatizados',
    skills: ['Playwright', 'BDD', 'Gherkin', 'Node.js', 'Testes unitários', 'Testes de componente']
  },
  {
    id: 'devops-tools',
    title: 'DevOps e ferramentas',
    skills: ['Git', 'Maven', 'Docker', 'GitHub Actions', 'WildFly', 'Azure', 'AWS']
  },
  {
    id: 'automation-low-code',
    title: 'Automação e low-code',
    skills: ['JBPM', 'BPMN', 'Oracle APEX', 'n8n', 'ManyChat']
  },
  {
    id: 'reporting-other',
    title: 'Relatórios e outras tecnologias',
    skills: ['JasperReports', 'XML', 'Python']
  }
];
