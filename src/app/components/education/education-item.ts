export interface EducationItem {
  readonly id: string;
  readonly degree: string;
  readonly institution: string;
  readonly institutionShortName: string;
  readonly startYear: string;
  readonly endYear: string;
  readonly status?: string;
  readonly details?: string;
}
