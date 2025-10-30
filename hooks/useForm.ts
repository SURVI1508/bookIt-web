import { useState, useCallback } from "react";

type ValidationSchema =
  | {
      safeParse?: (data: any) => { success: boolean; error?: any };
    }
  | {
      validateSync?: (data: any, options?: any) => void;
    }
  | null;

type UseFormOptions<T> = {
  defaultValues?: T;
  schema?: ValidationSchema;
  validate?: ((data: T) => Record<string, string> | null) | null;
  onServerError?: ((errors: Record<string, string>) => void) | null;
};

export const useForm = <T extends Record<string, any>>({
  defaultValues = {} as T,
  schema = null,
  validate = null,
  onServerError = null,
}: UseFormOptions<T> = {}) => {
  const [formData, setFormData] = useState<T>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field as string]: "" }));
  }, []);

  const validateFields = useCallback((): boolean => {
    if (!schema && !validate) return true;

    let validationErrors: Record<string, string> = {};

    // Zod
    if ("safeParse" in (schema || {})) {
      const result = (schema as any).safeParse(formData);
      if (!result.success) {
        result.error.errors.forEach((err: any) => {
          const key = err.path[0];
          validationErrors[key] = err.message;
        });
      }
    }

    // Yup
    else if ("validateSync" in (schema || {})) {
      try {
        (schema as any).validateSync(formData, { abortEarly: false });
      } catch (err: any) {
        err.inner.forEach((e: any) => {
          validationErrors[e.path] = e.message;
        });
      }
    }

    // Custom validation
    if (typeof validate === "function") {
      const customErrors = validate(formData);
      if (customErrors) {
        validationErrors = { ...validationErrors, ...customErrors };
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData, schema, validate]);

  const handleSubmit = useCallback(
    (submitFn: (data: T) => Promise<void> | void) =>
      async (e?: React.FormEvent) => {
        e?.preventDefault?.();
        setErrors({});
        setIsSubmitting(true);

        const isValid = validateFields();
        if (!isValid) {
          setIsSubmitting(false);
          return;
        }

        try {
          await submitFn(formData);
        } catch (error: any) {
          if (error && typeof error === "object" && !Array.isArray(error)) {
            const fieldErrors: Record<string, string> = {};
            for (const key in error) {
              fieldErrors[key] = error[key];
            }
            setErrors(fieldErrors);
            onServerError?.(fieldErrors);
          } else {
            console.error("Non-field server error:", error);
          }
        } finally {
          setIsSubmitting(false);
        }
      },
    [formData, validateFields, onServerError]
  );

  const setFieldError = useCallback((field: keyof T, message: string) => {
    setErrors((prev) => ({ ...prev, [field as string]: message }));
  }, []);

  const reset = useCallback(() => {
    setFormData(defaultValues);
    setErrors({});
  }, [defaultValues]);

  return {
    formData,
    setFormData,
    handleChange,
    errors,
    setErrors,
    setError: setFieldError,
    handleSubmit,
    reset,
    isSubmitting,
  };
};
