import { z } from 'zod'

/** Error messages are translation keys, resolved in the form. */
export const loginSchema = z.object({
  email: z.email({ message: 'login.errors.email' }),
  password: z.string().min(1, { message: 'login.errors.password' }),
})

export type LoginValues = z.infer<typeof loginSchema>
