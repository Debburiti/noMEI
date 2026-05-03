/**
 * @file src/components/Input.tsx
 * @description Campo de texto reutilizável do noMEI.
 *
 * Funcionalidades:
 *  - Borda sutil em repouso; destaque azul no foco
 *  - Ícone à esquerda (ex: lupa de busca)
 *  - Ícone à direita clicável (ex: olho para senha)
 *  - Prop clearable — exibe botão "×" quando há texto
 *  - Estados error (borda vermelha + hint) e hint (texto de ajuda)
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, textPresets } from '../theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  clearable?: boolean;
  error?: string;
  hint?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Input({
  label,
  leftIcon,
  rightIcon,
  onRightIconPress,
  clearable = false,
  error,
  hint,
  containerStyle,
  value,
  onChangeText,
  ...rest
}: InputProps): React.JSX.Element {
  const [focused, setFocused] = useState(false);

  const hasError = Boolean(error);
  const showClear = clearable && Boolean(value);

  return (
    <View style={[styles.container, containerStyle]}>
      {label != null && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          hasError && styles.inputWrapperError,
        ]}
      >
        {leftIcon != null && (
          <Ionicons
            name={leftIcon}
            size={18}
            color={focused ? colors.primary : colors.placeholder}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={colors.placeholder}
          {...rest}
        />

        {showClear && (
          <TouchableOpacity
            onPress={() => onChangeText?.('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color={colors.placeholder} />
          </TouchableOpacity>
        )}

        {rightIcon != null && !showClear && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={onRightIconPress == null}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={rightIcon}
              size={18}
              color={focused ? colors.primary : colors.placeholder}
            />
          </TouchableOpacity>
        )}
      </View>

      {hasError && <Text style={styles.errorText}>{error}</Text>}
      {!hasError && hint != null && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    ...textPresets.labelMd,
    color: colors.textPrimary,
    marginBottom: spacing[1],
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing[3],
    minHeight: 48,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  leftIcon: {
    marginRight: spacing[2],
  },
  input: {
    flex: 1,
    ...textPresets.bodyMd,
    color: colors.textPrimary,
    paddingVertical: spacing[2],
  },
  errorText: {
    ...textPresets.bodySm,
    color: colors.error,
    marginTop: spacing[1],
  },
  hintText: {
    ...textPresets.bodySm,
    color: colors.textSecondary,
    marginTop: spacing[1],
  },
});
