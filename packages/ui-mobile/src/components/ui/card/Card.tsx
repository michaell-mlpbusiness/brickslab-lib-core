import React from 'react';
import { View, ViewStyle } from 'react-native';
import { tokens } from '@/tokens';

export interface CardProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  style,
  variant = 'default',
  padding = 'md',
}: CardProps) {
  const paddingValue = padding === 'sm' ? tokens.space2 : padding === 'lg' ? tokens.space6 : tokens.space4;

  const cardStyle: ViewStyle = {
    backgroundColor: tokens.colorBg,
    borderRadius: tokens.radiusMd,
    padding: paddingValue,
    ...getVariantStyle(variant),
    ...style,
  };

  return <View style={cardStyle}>{children}</View>;
}

function getVariantStyle(variant: CardProps['variant']): ViewStyle {
  switch (variant) {
    case 'elevated':
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      };
    case 'outlined':
      return {
        borderWidth: 1,
        borderColor: tokens.cBorder,
      };
    default:
      return {};
  }
}
