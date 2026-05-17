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

type Translate = (key: string) => string

export function createProfileSchemas(t: Translate) {
  const ageSchema = z.coerce
    .number()
    .int()
    .min(15, { message: t("errors.ageRange") })
    .max(100, { message: t("errors.ageRange") })

  const stateSchema = z.string().trim().min(1, { message: t("errors.stateRequired") })
  const districtSchema = z.string().trim().min(1, { message: t("errors.districtRequired") })
  const occupationSchema = z.enum(OCCUPATION_VALUES)
  const categorySchema = z.enum(CATEGORY_VALUES)
  const genderSchema = z.enum(GENDER_VALUES)
  const incomeRangeSchema = z.enum(INCOME_RANGE_VALUES)
  const goalsSchema = z.array(z.string()).min(1, { message: t("errors.goalsRequired") })

  const genderConflictCheck = (
    data: { gender: (typeof GENDER_VALUES)[number]; isPregnant: boolean; isHeadOfHousehold: boolean },
    ctx: z.RefinementCtx,
  ) => {
    if (data.gender !== "female" && data.isPregnant) {
      ctx.addIssue({ code: "custom", path: ["isPregnant"], message: t("errors.pregnancyOnlyFemale") })
    }
    if (data.gender !== "female" && data.isHeadOfHousehold) {
      ctx.addIssue({ code: "custom", path: ["isHeadOfHousehold"], message: t("errors.headOfHouseholdOnlyFemale") })
    }
  }

  const profileStep1Schema = z
    .object({
      age: ageSchema,
      gender: genderSchema,
      isPregnant: z.boolean().optional().default(false),
      isHeadOfHousehold: z.boolean().optional().default(false),
    })
    .superRefine(genderConflictCheck)

  const profileStep2Schema = z.object({
    state: stateSchema,
    district: districtSchema,
  })

  const profileStep3Schema = z.object({
    occupation: occupationSchema,
    incomeRange: incomeRangeSchema,
    category: categorySchema,
  })

  const profileStep4Schema = z.object({
    goals: goalsSchema,
  })

  const profileSubmissionSchema = z
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

  return {
    profileStep1Schema,
    profileStep2Schema,
    profileStep3Schema,
    profileStep4Schema,
    profileSubmissionSchema,
  }
}
