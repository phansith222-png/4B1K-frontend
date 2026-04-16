import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export const registerFrontendSchema = z.object({
    // --- เปลี่ยนจาก identity เป็น email และ telephone แยกกัน ---
    email: z.string().min(1, "Email is required")
        .regex(emailRegex, "Invalid email format"),
    telephone: z.string().optional(), // ให้เป็น Optional เผื่อคนไม่อยากกรอกเบอร์
    
    username: z.string().min(8, "Username must have more than 8 characters"),
    firstName: z.string().min(1, "Firstname is required"),
    lastName: z.string().min(1, "Lastname is required"),
    password: z.string().min(8, "Password must be at least 8 characters")
        .regex(passwordRegex, "Password does not meet requirements (Need A-Z, a-z, 0-9)"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    profileImage: z.string().optional(),
    nationalId: z.string().optional()
}).refine(input => input.password === input.confirmPassword, {
    message: "Password must match with confirm password",
    path: ['confirmPassword'] 
});