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

const nameSchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z\s']{2,50}$/)
  .refine((value) => (value.match(/[A-Za-z]/g)?.length ?? 0) >= 2)

const ageSchema = z.coerce
  .number()
  .int()
  .min(15)
  .max(100)

const annualIncomeSchema = z.coerce
  .number()
  .int()
  .min(0)
  .max(1_000_000_000) // 10 crore

const stateSchema = z.string().trim().min(1)
const districtSchema = z.string().trim().min(1)
const occupationSchema = z.enum(OCCUPATION_VALUES)
const categorySchema = z.enum(CATEGORY_VALUES)
const genderSchema = z.enum(GENDER_VALUES)
const goalsSchema = z.array(z.string()).min(1)

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
    name: nameSchema,
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
  annualIncome: annualIncomeSchema,
  category: categorySchema,
})

export const profileStep4Schema = z.object({
  goals: goalsSchema,
})

export const profileSubmissionSchema = z
  .object({
    name: nameSchema,
    age: ageSchema,
    gender: genderSchema,
    state: stateSchema,
    district: districtSchema,
    occupation: occupationSchema,
    annualIncome: annualIncomeSchema,
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

