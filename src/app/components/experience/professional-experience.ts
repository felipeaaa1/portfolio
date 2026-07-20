export interface ProfessionalExperience {
  readonly id: string;
  readonly role: string;
  readonly company: string;
  readonly startDate: string;
  readonly startLabel: string;
  readonly endDate?: string;
  readonly endLabel: string;
  readonly description: readonly string[];
  readonly technologies: readonly string[];
}
