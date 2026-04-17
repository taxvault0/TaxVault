export type BaseStepProps = {
  styles: any;
  colors: any;
  formData: any;
  fieldErrors: Record<string, string>;
  updateField: (field: string, value: any) => void;
  clearFieldError: (field: string) => void;
  renderInput: (config: any) => React.ReactNode;
  renderPasswordInput?: (config: any) => React.ReactNode;
  renderPicker?: (config: any) => React.ReactNode;
  renderDateField?: (config: any) => React.ReactNode;
  renderTaxCard?: (item: any, selected: boolean, onPress: () => void, disabled?: boolean) => React.ReactNode;
  setFieldRef?: (field: string) => (event: any) => void;
};

export type NavButtonsProps = {
  currentStep: number;
  loading: boolean;
  stepsLength: number;
  renderNavButton: (args: any) => React.ReactNode;
  handlePrevious: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  styles: any;
};

export type ProgressStepsProps = {
  steps: Array<{ number: number; title: string; icon: string }>;
  currentStep: number;
  styles: any;
  colors: any;
};