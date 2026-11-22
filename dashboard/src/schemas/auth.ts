import { z } from 'zod'

import { adminRoles } from '@/app/nav'

/** Request and response shapes for the admin auth endpoints. The mock API in `src/api/auth.ts` follows them. */

export const adminRoleSchema = z.enum(adminRoles)

/** POST /admin/auth/login */
export const loginRequestSchema = z.object({
  email: z.email({ message: 'login.errors.email' }),
  password: z.string().min(1, { message: 'login.errors.password' }),
})
export type LoginRequest = z.infer<typeof loginRequestSchema>

export const adminUserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.email(),
  role: adminRoleSchema,
})
export type AdminUser = z.infer<typeof adminUserSchema>

export const loginResponseSchema = z.object({
  admin: adminUserSchema,
  /** Short-lived access token, kept in memory. The refresh token is an httpOnly cookie, never read by the page. */
  accessToken: z.string(),
  /** Seconds until the access token expires. */
  expiresIn: z.number().int().positive(),
})
export type LoginResponse = z.infer<typeof loginResponseSchema>

/** POST /admin/auth/logout. Revokes the refresh token and clears its cookie. No body needed. */
export const logoutResponseSchema = z.object({ ok: z.literal(true) })
export type LogoutResponse = z.infer<typeof logoutResponseSchema>

/** POST /admin/auth/change-password. The server checks the current password; the page checks the new one. */
export const changePasswordRequestSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'password.errors.current' }),
    newPassword: z
      .string()
      .min(8, { message: 'password.errors.min' })
      .regex(/[A-Za-z]/, { message: 'password.errors.letter' })
      .regex(/\d/, { message: 'password.errors.digit' }),
    confirmPassword: z.string().min(1, { message: 'password.errors.confirm' }),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { message: 'password.errors.match', path: ['confirmPassword'] })
  .refine((v) => v.newPassword !== v.currentPassword, { message: 'password.errors.same', path: ['newPassword'] })
export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>

export const changePasswordResponseSchema = z.object({ ok: z.literal(true), changedAt: z.iso.datetime() })
export type ChangePasswordResponse = z.infer<typeof changePasswordResponseSchema>
