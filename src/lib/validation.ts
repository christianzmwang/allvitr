import { z } from 'zod'

export const LeadsSearchSchema = z.object({
  keywords: z.string().trim().max(200).optional(),
  category: z.string().trim().max(100).optional(),
  location: z.string().trim().max(100).optional(),
  radiusKm: z.coerce.number().int().min(0).max(500).optional(),
  hiring: z.boolean().optional(),
  ads: z.boolean().optional(),
  newlyOpened: z.boolean().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  minReviews: z.coerce.number().int().min(0).max(10000).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
})

export type LeadsSearchInput = z.infer<typeof LeadsSearchSchema>

export function sanitizeString(
  value: string | undefined | null,
): string | undefined {
  if (!value) return undefined
  return value.replace(/[<>`]/g, '').trim()
}
