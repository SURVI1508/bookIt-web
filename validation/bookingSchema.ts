import * as yup from "yup";

export const bookingSchema = yup.object().shape({
  productId: yup.string().trim().required("Product ID is required"),

  date: yup.string().trim().required("Date is required"),

  time: yup.string().trim().required("Time is required"),

  qty: yup
    .string()
    .required("Quantity is required")
    .min(1, "Quantity must be at least 1"),

  promoCode: yup
    .string()
    .trim()
    .matches(
      /^[A-Z0-9]*$/,
      "Promo code must be uppercase alphanumeric (A-Z, 0-9)"
    )
    .optional()
    .nullable(),

  name: yup
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .matches(/^[A-Za-z\s]+$/, "Name must contain only alphabets")
    .required("Name is required"),

  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .matches(
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
      "Email must be a valid Gmail address (e.g. example@gmail.com)"
    )
    .required("Email is required"),
});
