import { loginRequestSchema, type LoginRequest } from '@/schemas/auth'

/** The sign-in form validates with the same schema the login request uses. */
export const loginSchema = loginRequestSchema
export type LoginValues = LoginRequest
