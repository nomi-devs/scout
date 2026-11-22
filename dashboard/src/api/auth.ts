import {
  loginRequestSchema,
  loginResponseSchema,
  logoutResponseSchema,
  type LoginRequest,
  type LoginResponse,
  type LogoutResponse,
} from '@/schemas/auth'

/** Simulated network time so loading states are visible. Zero under test. */
const latency = () => new Promise<void>((resolve) => setTimeout(resolve, import.meta.env.MODE === 'test' ? 0 : 350))

/**
 * Mock of POST /admin/auth/login. Any valid email signs in as a super admin.
 * Replace the body with a real `fetch` during integration; the schemas stay.
 */
export async function login(input: LoginRequest): Promise<LoginResponse> {
  const body = loginRequestSchema.parse(input)
  await latency()
  return loginResponseSchema.parse({
    admin: { id: 'a1', name: 'Scout Admin', email: body.email, role: 'super_admin' },
    accessToken: 'mock-access-token',
    expiresIn: 900,
  })
}

/** Mock of POST /admin/auth/logout: the server revokes the refresh token, then the page drops its session. */
export async function logout(): Promise<LogoutResponse> {
  await latency()
  return logoutResponseSchema.parse({ ok: true })
}
