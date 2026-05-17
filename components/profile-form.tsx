"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowRight,
  ArrowLeft,
  User,
  MapPin,
  Briefcase,
  Target,
  Radar,
} from "lucide-react"
import {
  CATEGORY_VALUES,
  INCOME_RANGE_VALUES,
  OCCUPATION_VALUES,
  createProfileSchemas,
} from "@/lib/profile-schema"
import { useRouter } from "@/i18n/navigation"

const STATE_VALUES = [
  "Karnataka",
  "Maharashtra",
  "Tamil Nadu",
  "Kerala",
  "Andhra Pradesh",
  "Telangana",
  "Rajasthan",
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Gujarat",
  "Bihar",
  "West Bengal",
  "Punjab",
  "Odisha",
  "Other",
] as const

const GOAL_OPTIONS = [
  { value: "Get financial assistance", labelKey: "options.goals.financial" },
  { value: "Start or grow a business", labelKey: "options.goals.business" },
  { value: "Education support", labelKey: "options.goals.education" },
  { value: "Housing assistance", labelKey: "options.goals.housing" },
  { value: "Health insurance", labelKey: "options.goals.health" },
  { value: "Pension & retirement", labelKey: "options.goals.pension" },
  { value: "Skill development", labelKey: "options.goals.skills" },
  { value: "Agricultural support", labelKey: "options.goals.agriculture" },
] as const

export function ProfileForm() {
  const t = useTranslations("ProfileForm")
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showErrors, setShowErrors] = useState(false)
  const totalSteps = 4
  const schemas = useMemo(() => createProfileSchemas((key) => t(key)), [t])
  const occupations = useMemo(
    () => OCCUPATION_VALUES.map((value) => ({ value, label: t(`options.occupation.${value}`) })),
    [t],
  )
  const states = useMemo(
    () => STATE_VALUES.map((value) => ({ value, label: t(`options.states.${value}`) })),
    [t],
  )
  const categories = useMemo(
    () => CATEGORY_VALUES.map((value) => ({ value, label: t(`options.category.${value}`) })),
    [t],
  )
  const incomeRanges = useMemo(
    () => INCOME_RANGE_VALUES.map((value) => ({ value, label: t(`options.incomeRanges.${value}`) })),
    [t],
  )

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    state: "",
    district: "",
    occupation: "",
    incomeRange: "",
    category: "",
    isRural: false,
    isBPL: false,
    isPregnant: false,
    isStreetVendor: false,
    isArtisan: false,
    isHeadOfHousehold: false,
    goals: [] as string[],
  })

  const updateField = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => {
      if (field === "gender" && typeof value === "string" && value !== "female") {
        return { ...prev, [field]: value, isPregnant: false, isHeadOfHousehold: false }
      }
      return { ...prev, [field]: value }
    })
  }

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }))
  }

  const stepValidation = useMemo(() => {
    switch (step) {
      case 1:
        return schemas.profileStep1Schema.safeParse({
          age: formData.age,
          gender: formData.gender,
          isPregnant: formData.isPregnant,
          isHeadOfHousehold: formData.isHeadOfHousehold,
        })
      case 2:
        return schemas.profileStep2Schema.safeParse({
          state: formData.state,
          district: formData.district,
        })
      case 3:
        return schemas.profileStep3Schema.safeParse({
          occupation: formData.occupation,
          incomeRange: formData.incomeRange,
          category: formData.category,
        })
      case 4:
        return schemas.profileStep4Schema.safeParse({ goals: formData.goals })
      default:
        return { success: false as const, error: null }
    }
  }, [step, formData, schemas])

  const stepErrors = useMemo(() => {
    const errors: Record<string, string> = {}
    if (stepValidation.success || !stepValidation.error) return errors

    for (const issue of stepValidation.error.issues) {
      const field = String(issue.path[0] ?? "")
      if (errors[field]) continue

      if (field === "gender" && issue.message.includes("Invalid option")) {
        errors[field] = t("errors.genderRequired")
      } else if (field === "occupation" && issue.message.includes("Invalid option")) {
        errors[field] = t("errors.occupationRequired")
      } else if (field === "incomeRange" && issue.message.includes("Invalid option")) {
        errors[field] = t("errors.incomeRequired")
      } else if (field === "category" && issue.message.includes("Invalid option")) {
        errors[field] = t("errors.categoryRequired")
      } else {
        errors[field] = issue.message
      }
    }
    return errors
  }, [stepValidation, t])

  const canProceed = stepValidation.success

  const handleContinue = () => {
    if (!canProceed) {
      setShowErrors(true)
      return
    }
    setShowErrors(false)
    setStep((s) => s + 1)
  }

  const handleSubmit = () => {
    const parsed = schemas.profileSubmissionSchema.safeParse(formData)
    if (!parsed.success) {
      setShowErrors(true)
      return
    }
    const data = parsed.data

    if (typeof window !== "undefined") {
      sessionStorage.setItem("yojanasaarthi_profile", JSON.stringify(data))
    }
    const params = new URLSearchParams({
      age: String(data.age),
      gender: data.gender,
      state: data.state,
      district: data.district,
      occupation: data.occupation,
      incomeRange: data.incomeRange,
      category: data.category,
      isRural: String(data.isRural),
      isBPL: String(data.isBPL),
      isPregnant: String(data.isPregnant),
      isStreetVendor: String(data.isStreetVendor),
      isArtisan: String(data.isArtisan),
      isHeadOfHousehold: String(data.isHeadOfHousehold),
      goals: data.goals.join(","),
    })
    router.push(`/results?${params.toString()}`)
  }

  const stepIcons = [User, MapPin, Briefcase, Target]
  const stepLabels = [t("stepLabels.personal"), t("stepLabels.location"), t("stepLabels.occupation"), t("stepLabels.goals")]
  const stepDescriptors = [t("stepDescriptors.personal"), t("stepDescriptors.location"), t("stepDescriptors.occupation"), t("stepDescriptors.goals")]

  const ageValue = Number.parseInt(formData.age, 10)
  const hasValidAgeNumber = Number.isFinite(ageValue)
  const ageSignal = (() => {
    if (!formData.age) return t("signals.awaitingInput")
    if (!hasValidAgeNumber || ageValue < 15 || ageValue > 100) return t("signals.outsideRange")
    if (ageValue <= 17) return t("signals.age1517")
    if (ageValue <= 40) return t("signals.age1840")
    if (ageValue <= 60) return t("signals.age4160")
    return t("signals.age61100")
  })()

  const incomeSignal = (() => {
    if (!formData.incomeRange) return t("signals.awaitingInput")
    return t(`options.incomeRanges.${formData.incomeRange}`)
  })()

  const categorySignal = (() => {
    if (!formData.category) return t("signals.awaitingInput")
    if (["sc", "st", "obc"].includes(formData.category)) return t("signals.applicable")
    return t("signals.generalCoverage")
  })()

  const hardDisqualifiers: string[] = []
  if (formData.age && (!hasValidAgeNumber || ageValue < 15 || ageValue > 100)) {
    hardDisqualifiers.push(t("signals.ageRangeIssue"))
  }
  if (formData.gender && formData.gender !== "female" && formData.isPregnant) {
    hardDisqualifiers.push(t("signals.pregnancyConflict"))
  }

  return (
    <div className="mx-auto w-full max-w-6xl" suppressHydrationWarning>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-md border border-border bg-card p-5 sm:p-6">
          <div className="mb-8 flex items-start justify-between gap-2">
            {stepLabels.map((label, i) => {
              const Icon = stepIcons[i]
              const isActive = step === i + 1
              const isDone = step > i + 1
              return (
                <div key={label} className="flex flex-1 items-start">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : isDone
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${
                        isActive ? "text-primary" : isDone ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {label}
                    </span>
                    <span className="text-center text-[10px] leading-tight text-muted-foreground">
                      {stepDescriptors[i]}
                    </span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div
                      className={`mx-2 mt-4 hidden h-0.5 flex-1 rounded-full sm:block ${
                        isDone ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2
                  className="text-xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t("sections.personalTitle")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("sections.personalDescription")}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="age" className="font-semibold text-foreground">{t("labels.age")}</Label>
                    <Input
                      id="age"
                      type="text"
                      inputMode="numeric"
                      placeholder={t("placeholders.age")}
                      value={formData.age}
                      onChange={(e) => updateField("age", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">{t("hints.age")}</p>
                    {showErrors && stepErrors.age && (
                      <p className="text-xs font-medium text-destructive">{stepErrors.age}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="gender" className="font-semibold text-foreground">{t("labels.gender")}</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(v) => updateField("gender", v)}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder={t("placeholders.gender")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t("options.gender.male")}</SelectItem>
                        <SelectItem value="female">{t("options.gender.female")}</SelectItem>
                        <SelectItem value="other">{t("options.gender.other")}</SelectItem>
                      </SelectContent>
                    </Select>
                    {showErrors && stepErrors.gender && (
                      <p className="text-xs font-medium text-destructive">{stepErrors.gender}</p>
                    )}
                  </div>
                </div>

                {formData.gender === "female" && (
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="isPregnant"
                      checked={formData.isPregnant}
                      onCheckedChange={(v) => updateField("isPregnant", !!v)}
                    />
                    <Label htmlFor="isPregnant" className="text-sm text-muted-foreground">
                      {t("checkboxes.pregnant")}
                    </Label>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2
                  className="text-xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t("sections.locationTitle")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("sections.locationDescription")}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="state" className="font-semibold text-foreground">{t("labels.state")}</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(v) => updateField("state", v)}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder={t("placeholders.state")} />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {showErrors && stepErrors.state && (
                    <p className="text-xs font-medium text-destructive">{stepErrors.state}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="district" className="font-semibold text-foreground">{t("labels.district")}</Label>
                  <Input
                    id="district"
                    placeholder={t("placeholders.district")}
                    value={formData.district}
                    onChange={(e) => updateField("district", e.target.value)}
                  />
                  {showErrors && stepErrors.district && (
                    <p className="text-xs font-medium text-destructive">{stepErrors.district}</p>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="isRural"
                    checked={formData.isRural}
                    onCheckedChange={(v) => updateField("isRural", !!v)}
                  />
                  <Label htmlFor="isRural" className="text-sm text-muted-foreground">
                    {t("checkboxes.rural")}
                  </Label>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2
                  className="text-xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t("sections.occupationTitle")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("sections.occupationDescription")}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="occupation" className="font-semibold text-foreground">{t("labels.occupation")}</Label>
                  <Select
                    value={formData.occupation}
                    onValueChange={(v) => updateField("occupation", v)}
                  >
                    <SelectTrigger id="occupation">
                      <SelectValue placeholder={t("placeholders.occupation")} />
                    </SelectTrigger>
                    <SelectContent>
                      {occupations.map((occupation) => (
                        <SelectItem key={occupation.value} value={occupation.value}>
                          {occupation.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {showErrors && stepErrors.occupation && (
                    <p className="text-xs font-medium text-destructive">{stepErrors.occupation}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="incomeRange" className="font-semibold text-foreground">{t("labels.incomeRange")}</Label>
                  <Select
                    value={formData.incomeRange}
                    onValueChange={(v) => updateField("incomeRange", v)}
                  >
                    <SelectTrigger id="incomeRange">
                      <SelectValue placeholder={t("placeholders.incomeRange")} />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{t("hints.incomeRange")}</p>
                  {showErrors && stepErrors.incomeRange && (
                    <p className="text-xs font-medium text-destructive">{stepErrors.incomeRange}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="category" className="font-semibold text-foreground">{t("labels.category")}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => updateField("category", v)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder={t("placeholders.category")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {showErrors && stepErrors.category && (
                    <p className="text-xs font-medium text-destructive">{stepErrors.category}</p>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="isBPL"
                    checked={formData.isBPL}
                    onCheckedChange={(v) => updateField("isBPL", !!v)}
                  />
                  <Label htmlFor="isBPL" className="text-sm text-muted-foreground">
                    {t("checkboxes.bpl")}
                  </Label>
                </div>

                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="isStreetVendor"
                    checked={formData.isStreetVendor}
                    onCheckedChange={(v) => updateField("isStreetVendor", !!v)}
                  />
                  <Label htmlFor="isStreetVendor" className="text-sm text-muted-foreground">
                    {t("checkboxes.streetVendor")}
                  </Label>
                </div>

                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="isArtisan"
                    checked={formData.isArtisan}
                    onCheckedChange={(v) => updateField("isArtisan", !!v)}
                  />
                  <Label htmlFor="isArtisan" className="text-sm text-muted-foreground">
                    {t("checkboxes.artisan")}
                  </Label>
                </div>

                {formData.gender === "female" && (
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="isHeadOfHousehold"
                      checked={formData.isHeadOfHousehold}
                      onCheckedChange={(v) => updateField("isHeadOfHousehold", !!v)}
                    />
                    <Label htmlFor="isHeadOfHousehold" className="text-sm text-muted-foreground">
                      {t("checkboxes.headOfHousehold")}
                    </Label>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2
                  className="text-xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t("sections.goalsTitle")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("sections.goalsDescription")}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {GOAL_OPTIONS.map((goal) => {
                  const isSelected = formData.goals.includes(goal.value)
                  return (
                    <button
                      key={goal.value}
                      type="button"
                      onClick={() => toggleGoal(goal.value)}
                      className={`flex items-center gap-3 rounded-md border p-3 text-left text-sm font-medium transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border ${
                          isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        )}
                      </div>
                      {t(goal.labelKey)}
                    </button>
                  )
                })}
              </div>
              {showErrors && stepErrors.goals && (
                <p className="text-xs font-medium text-destructive">{stepErrors.goals}</p>
              )}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setShowErrors(false)
                setStep((s) => s - 1)
              }}
              disabled={step === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("buttons.back")}
            </Button>

            {step < totalSteps ? (
              <Button
                onClick={handleContinue}
                className="gap-2"
              >
                {t("buttons.continue")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="gap-2"
              >
                {t("buttons.submit")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-md border border-border bg-card p-5 lg:sticky lg:top-24">
          <div className="mb-4 flex items-center gap-2">
            <Radar className="h-4 w-4 text-primary" />
            <h3
              className="text-sm font-semibold uppercase tracking-wide text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("labels.eligibilitySignals")}
            </h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="rounded-sm border border-border bg-muted/20 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("labels.ageBand")}</p>
              <p className="mt-1 font-medium text-foreground">{ageSignal}</p>
            </div>
            <div className="rounded-sm border border-border bg-muted/20 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("labels.incomeBand")}</p>
              <p className="mt-1 font-medium text-foreground">{incomeSignal}</p>
            </div>
            <div className="rounded-sm border border-border bg-muted/20 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("labels.categoryTargeting")}</p>
              <p className="mt-1 font-medium text-foreground">{categorySignal}</p>
            </div>
            <div className="rounded-sm border border-border bg-muted/20 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("labels.hardDisqualifiers")}</p>
              <p className="mt-1 font-medium text-foreground">
                {hardDisqualifiers.length > 0 ? hardDisqualifiers[0] : t("signals.noneDetected")}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
