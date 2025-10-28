import { useState, useCallback } from "react";

export const useForm = ({
  defaultValues = {},
  schema = null,
  validate = null,
  onServerError = null,
} = {}) => {
  const [formData, setFormData] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(errors);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const validateFields = useCallback(() => {
    if (!schema && !validate) return true;

    let validationErrors = {};

    // ✅ Zod
    if (schema?.safeParse) {
      const result = schema.safeParse(formData);
      if (!result.success) {
        result.error.errors.forEach((err) => {
          const key = err.path[0];
          validationErrors[key] = err.message;
        });
      }
    }

    // ✅ Yup
    else if (schema?.validateSync) {
      try {
        schema.validateSync(formData, { abortEarly: false });
      } catch (err) {
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
      }
    }

    // ✅ Custom validator
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
    (submitFn) => async (e) => {
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
      } catch (error) {
        // 👇 Auto-handle field errors if they follow { field: message }
        if (error && typeof error === "object" && !Array.isArray(error)) {
          const fieldErrors = {};
          for (const key in error) {
            fieldErrors[key] = error[key];
          }
          setErrors(fieldErrors);
        } else {
          console.error("Non-field server error:", error);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateFields],
  );

  const setFieldError = useCallback((field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
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
