import { z } from "zod";

const formSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters")
        .refine((value) => value.trim().split(/\s+/).length >= 2, {
            message: "Please enter both first and last name",
        }),

    phoneNumber: z.string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),

    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export default formSchema;