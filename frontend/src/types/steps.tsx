export type StepStatusType = 'wait' | 'process' | 'finish' | 'error';
export type StepType = {
  title: string;
  description?: string;
  status: StepStatusType;
};
