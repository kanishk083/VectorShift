import { useState, useCallback } from 'react';

export function useFieldState(fields, data = {}, defaults = {}) {
  const [values, setValues] = useState(() => {
    const initial = {};
    for (const field of fields) {
      initial[field.name] = data[field.name] ?? defaults[field.name] ?? field.default ?? '';
    }
    return initial;
  });

  const handleChange = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  return [values, handleChange];
}
