import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Validation schema for user registration.
 */
export const registerFrontendSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    telephone: z.string()
        .length(10, "Phone number must be exactly 10 digits")
        .optional()
        .or(z.literal('')),
    username: z.string().min(8, "Username must have more than 8 characters"),
    firstName: z.string().min(1, "Firstname is required"),
    lastName: z.string().min(1, "Lastname is required"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(passwordRegex, "Password does not meet requirements (Need A-Z, a-z, 0-9, and a special character)"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    profileImage: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    nationalId: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
    message: "Password must match with confirm password",
    path: ['confirmPassword'] 
});
