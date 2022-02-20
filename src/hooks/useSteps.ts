import { StepStatusType, StepType } from '@/types/steps';
import { useCallback, useMemo, useState } from 'react';

export const useSteps = (_steps: Omit<StepType, 'status'>[]) => {
  const initialSteps = useMemo(() => _steps.map((step) => ({ ...step, status: 'wait' as StepStatusType })), [_steps]);

  const [current, setCurrent] = useState(0);
  const [steps, setSteps] = useState<StepType[]>(initialSteps);
  const [status, setStatus] = useState<StepStatusType>('wait');
  const [error, setStateError] = useState<string>('');

  const nextStep = (status: StepStatusType = 'finish') => {
    setStatus(status);
    setCurrent((val) => val + 1);
  };

  const setError = (error: string) => {
    setStatus('error');
    setStateError(error);
  };

  return {
    steps,
    current,
    status,
    error,
    setCurrent,
    setStatus,
    setError,
    nextStep,
  };
};
