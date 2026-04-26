import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

type Step = {
  number: number;
  title: string;
  icon: string;
};

type ProgressStepStyles = {
  progressScroll: StyleProp<ViewStyle>;
  progressScrollContent: StyleProp<ViewStyle>;
  progressItem: StyleProp<ViewStyle>;
  progressDot: StyleProp<ViewStyle>;
  progressDotActive: StyleProp<ViewStyle>;
  progressLabel: StyleProp<TextStyle>;
  progressLabelActive: StyleProp<TextStyle>;
  progressLine: StyleProp<ViewStyle>;
  progressLineActive: StyleProp<ViewStyle>;
};

type ProgressStepsProps = {
  steps: Step[];
  currentStep: number;
  styles: ProgressStepStyles;
  colors: {
    white: string;
    textSecondary: string;
  };
};

const ProgressSteps = ({
  steps,
  currentStep,
  styles,
  colors,
}: ProgressStepsProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.progressScrollContent}
      style={styles.progressScroll}
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <View style={styles.progressItem}>
            <View
              style={[
                styles.progressDot,
                currentStep >= step.number ? styles.progressDotActive : undefined,
              ]}
            >
              <Icon
                name={(currentStep > step.number ? 'check' : step.icon) as React.ComponentProps<typeof Icon>['name']}
                size={16}
                color={
                  currentStep >= step.number
                    ? colors.white
                    : colors.textSecondary
                }
              />
            </View>

            <Text
              style={[
                styles.progressLabel,
                currentStep >= step.number ? styles.progressLabelActive : undefined,
              ]}
            >
              {step.title}
            </Text>
          </View>

          {index < steps.length - 1 && (
            <View
              style={[
                styles.progressLine,
                currentStep > step.number ? styles.progressLineActive : undefined,
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </ScrollView>
  );
};

export default ProgressSteps;