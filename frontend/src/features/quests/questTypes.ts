export const RecurrenceOptions = {
  NONE: "NONE",
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY"
} as const;

export type Recurrence = typeof RecurrenceOptions[keyof typeof RecurrenceOptions];

export interface Quest {
  id: number;
  title: string;
  description?: string;
  difficulty: number;
  deadline?: string;
  recurrence?: Recurrence;
  hardDeadline?: boolean;
  completed: boolean;
}
