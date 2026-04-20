export const getStepIndex = (steps, currentStep) =>
  steps.findIndex((step) => step.step === currentStep);

export const getNextStep = (steps, currentStep) => {
  const index = getStepIndex(steps, currentStep);
  return steps[index + 1]?.step || currentStep;
};

export const getPreviousStep = (steps, currentStep) => {
  const index = getStepIndex(steps, currentStep);
  return steps[index - 1]?.step || currentStep;
};