import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  website: z.string().optional().or(z.literal('')),
  companyName: z.string().optional(),
  profession: z.string().min(1, 'Profession is required'),
  services: z.array(z.string()).min(1, 'At least one service is required'),
  biography: z.string().min(50, 'Biography must be at least 50 characters').optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  clientBaseSize: z.number().int().positive().optional(),
})

export const partnerInviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  category: z.string().min(1, 'Category is required'),
  notes: z.string().optional(),
})

export const referralSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Invalid email address'),
  clientPhone: z.string().optional(),
  clientNotes: z.string().optional(),
  receiverIds: z.array(z.string()).min(1, 'Select at least one partner'),
})

export const updateReferralStatusSchema = z.object({
  referralId: z.string(),
  status: z.enum(['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'LOST']),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type PartnerInviteInput = z.infer<typeof partnerInviteSchema>
export type ReferralInput = z.infer<typeof referralSchema>
export type UpdateReferralStatusInput = z.infer<typeof updateReferralStatusSchema>

