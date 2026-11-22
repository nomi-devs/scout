import { z } from 'zod'

/** `1.2.3` or `1.2.3+6` (build number). */
export const appVersionSchema = z.string().regex(/^\d+\.\d+\.\d+(\+\d+)?$/, { message: 'forceUpdate.errors.version' })
const storeLinkSchema = z.url({ protocol: /^https$/, message: 'forceUpdate.errors.link' })
const required = z.string().trim().min(1, { message: 'forceUpdate.errors.required' })

/**
 * PUT /admin/settings/app-version. When `enabled`, users on an older version are blocked until they update,
 * so every field must be valid before it can be switched on.
 */
export const forceUpdateSchema = z
  .object({
    enabled: z.boolean(),
    androidVersion: z.string().trim(),
    androidLink: z.string().trim(),
    iosVersion: z.string().trim(),
    iosLink: z.string().trim(),
    messageEn: z.string().trim(),
    messageAr: z.string().trim(),
  })
  .superRefine((v, ctx) => {
    const check = (path: keyof typeof v, schema: z.ZodType, value: string, optionalWhenOff = true) => {
      if (optionalWhenOff && !v.enabled && value === '') return
      const r = schema.safeParse(value)
      if (!r.success) ctx.addIssue({ code: 'custom', path: [path], message: r.error.issues[0]!.message })
    }
    check('androidVersion', appVersionSchema, v.androidVersion)
    check('iosVersion', appVersionSchema, v.iosVersion)
    check('androidLink', storeLinkSchema, v.androidLink)
    check('iosLink', storeLinkSchema, v.iosLink)
    check('messageEn', required, v.messageEn)
    check('messageAr', required, v.messageAr)
  })
export type ForceUpdateValues = z.infer<typeof forceUpdateSchema>
