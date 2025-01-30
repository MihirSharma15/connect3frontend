import { z } from "zod";

const formSchema = z.object({
    phoneNumber: z.string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),

    password: z.string()
});

export default formSchema;