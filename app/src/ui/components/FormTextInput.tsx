import React from 'react';
import { Controller } from 'react-hook-form';
import { TextInput, HelperText } from 'react-native-paper';

interface FormTextInputProps {
  name: string;
  control: any;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  rules?: Record<string, any>;
  multiline?: boolean;
  numberOfLines?: number;
}

export default function FormTextInput({
  name,
  control,
  label,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  rules = {},
  multiline = false,
  numberOfLines = 1,
}: FormTextInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <TextInput
            label={label}
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={numberOfLines}
            style={{ marginTop: 12 }}
            mode="outlined"
          />
          {error && <HelperText type="error" visible={!!error}>{error.message}</HelperText>}
        </>
      )}
    />
  );
}
