import  {z} from 'zod';


export const profileSchema = z.object({
  firstName: z.string().min(2, "ชื่อสั้นเกินไป"),
  lastName: z.string().min(2, "นามสกุลสั้นเกินไป"),
  gender: z.string().optional(),
  nationalId: z.string().length(13, "เลขบัตรประชาชนต้องมี 13 หลัก").optional().or(z.literal('')),
  username: z.string().min(3, "Username ต้องมี 3 ตัวอักษรขึ้นไป"),
  telephone: z.string().min(10, "เบอร์โทรไม่ถูกต้อง"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  bio: z.string().max(200, "Bio ยาวเกินไป").optional(),
});