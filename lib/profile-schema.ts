import { z } from "zod"

export const OCCUPATION_VALUES = [
  "farmer",
  "agricultural-laborer",
  "daily-wage",
  "self-employed",
  "small-business",
  "artisan",
  "homemaker",
  "student",
  "salaried",
  "unemployed",
] as const

export const CATEGORY_VALUES = ["general", "obc", "sc", "st"] as const
export const GENDER_VALUES = ["male", "female", "other"] as const
export const INCOME_RANGE_VALUES = ["lt1l", "1to3l", "3to5l", "5to10l", "gt10l"] as const

const ageSchema = z.coerce
  .number()
  .int()
  .min(15, { message: "Age must fall within modeled policy ranges (15-100)." })
  .max(100, { message: "Age must fall within modeled policy ranges (15-100)." })

const stateSchema = z.string().trim().min(1, { message: "State is required for state-level policy checks." })
const districtSchema = z.string().trim().min(1, { message: "District/City is required for residency validation." })
const occupationSchema = z.enum(OCCUPATION_VALUES)
const categorySchema = z.enum(CATEGORY_VALUES)
const genderSchema = z.enum(GENDER_VALUES)
const incomeRangeSchema = z.enum(INCOME_RANGE_VALUES)
const goalsSchema = z.array(z.string()).min(1, { message: "Select at least one goal for intent-based prioritization." })

const genderConflictCheck = (
  data: { gender: (typeof GENDER_VALUES)[number]; isPregnant: boolean; isHeadOfHousehold: boolean },
  ctx: z.RefinementCtx,
) => {
  if (data.gender !== "female" && data.isPregnant) {
    ctx.addIssue({ code: "custom", path: ["isPregnant"], message: "Pregnancy is only valid for female profiles." })
  }
  if (data.gender !== "female" && data.isHeadOfHousehold) {
    ctx.addIssue({ code: "custom", path: ["isHeadOfHousehold"], message: "Head-of-household flag is only valid for female profiles." })
  }
}

export const profileStep1Schema = z
  .object({
    age: ageSchema,
    gender: genderSchema,
    isPregnant: z.boolean().optional().default(false),
    isHeadOfHousehold: z.boolean().optional().default(false),
  })
  .superRefine(genderConflictCheck)

export const profileStep2Schema = z.object({
  state: stateSchema,
  district: districtSchema,
})

export const profileStep3Schema = z.object({
  occupation: occupationSchema,
  incomeRange: incomeRangeSchema,
  category: categorySchema,
})

export const profileStep4Schema = z.object({
  goals: goalsSchema,
})

export const profileSubmissionSchema = z
  .object({
    age: ageSchema,
    gender: genderSchema,
    state: stateSchema,
    district: districtSchema,
    occupation: occupationSchema,
    incomeRange: incomeRangeSchema,
    category: categorySchema,
    isRural: z.boolean().optional().default(false),
    isBPL: z.boolean().optional().default(false),
    isPregnant: z.boolean().optional().default(false),
    isStreetVendor: z.boolean().optional().default(false),
    isArtisan: z.boolean().optional().default(false),
    isHeadOfHousehold: z.boolean().optional().default(false),
    goals: goalsSchema,
  })
  .superRefine(genderConflictCheck)
