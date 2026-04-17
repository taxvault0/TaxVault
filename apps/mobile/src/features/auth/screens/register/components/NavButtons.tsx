import React from 'react';
import { View } from 'react-native';

type RenderNavButtonArgs = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
};

type NavButtonsProps = {
  currentStep: number;
  loading: boolean;
  stepsLength: number;
  renderNavButton: (args: RenderNavButtonArgs) => React.ReactNode;
  handlePrevious: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  styles: any;
};

const NavButtons = ({
  currentStep,
  loading,
  stepsLength,
  renderNavButton,
  handlePrevious,
  handleNext,
  handleSubmit,
  styles,
}: NavButtonsProps) => {
  return (
    <View style={styles.navButtons}>
      {currentStep > 1 ? (
        renderNavButton({
          label: 'Back',
          onPress: handlePrevious,
          variant: 'outline',
          disabled: loading,
        })
      ) : (
        <View style={styles.navButtonHalf} />
      )}

      {currentStep < stepsLength ? (
        renderNavButton({
          label: 'Next',
          onPress: handleNext,
          variant: 'primary',
          disabled: loading,
        })
      ) : (
        renderNavButton({
          label: loading ? 'Creating...' : 'Create Account',
          onPress: handleSubmit,
          variant: 'primary',
          disabled: loading,
        })
      )}
    </View>
  );
};

export default NavButtons;