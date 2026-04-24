import  {z} from 'zod';

export const profileSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  gender: z.string().optional(),
  nationalId: z.string().length(13, "National ID must be 13 digits").optional().or(z.literal('')),
  username: z.string().min(3, "Username must be at least 3 characters"),
  telephone: z.string().length(10, "Phone number must be exactly 10 digits"),
  email: z.string().email("Invalid email format"),
  bio: z.string().max(200, "Bio is too long").optional(),
});