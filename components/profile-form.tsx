"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
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
  profileStep1Schema,
  profileStep2Schema,
  profileStep3Schema,
  profileStep4Schema,
  profileSubmissionSchema,
} from "@/lib/profile-schema"

const OCCUPATIONS = [
  { value: "farmer", label: "Farmer" },
  { value: "agricultural-laborer", label: "Agricultural Laborer" },
  { value: "daily-wage", label: "Daily Wage Worker" },
  { value: "self-employed", label: "Self Employed" },
  { value: "small-business", label: "Small Business Owner" },
  { value: "artisan", label: "Artisan / Craftsperson" },
  { value: "homemaker", label: "Homemaker" },
  { value: "student", label: "Student" },
  { value: "salaried", label: "Salaried Employee" },
  { value: "unemployed", label: "Unemployed" },
]

const STATES = [
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
]

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
]

const INCOME_RANGES = [
  { value: "lt1l", label: "< Rs.1L" },
  { value: "1to3l", label: "Rs.1L - Rs.3L" },
  { value: "3to5l", label: "Rs.3L - Rs.5L" },
  { value: "5to10l", label: "Rs.5L - Rs.10L" },
  { value: "gt10l", label: "Rs.10L+" },
]

const GOALS = [
  "Get financial assistance",
  "Start or grow a business",
  "Education support",
  "Housing assistance",
  "Health insurance",
  "Pension & retirement",
  "Skill development",
  "Agricultural support",
]

export function ProfileForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showErrors, setShowErrors] = useState(false)
  const totalSteps = 4

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
        return profileStep1Schema.safeParse({
          age: formData.age,
          gender: formData.gender,
          isPregnant: formData.isPregnant,
          isHeadOfHousehold: formData.isHeadOfHousehold,
        })
      case 2:
        return profileStep2Schema.safeParse({
          state: formData.state,
          district: formData.district,
        })
      case 3:
        return profileStep3Schema.safeParse({
          occupation: formData.occupation,
          incomeRange: formData.incomeRange,
          category: formData.category,
        })
      case 4:
        return profileStep4Schema.safeParse({ goals: formData.goals })
      default:
        return { success: false as const, error: null }
    }
  }, [step, formData])

  const stepErrors = useMemo(() => {
    const errors: Record<string, string> = {}
    if (stepValidation.success || !stepValidation.error) return errors

    for (const issue of stepValidation.error.issues) {
      const field = String(issue.path[0] ?? "")
      if (errors[field]) continue

      if (field === "gender" && issue.message.includes("Invalid option")) {
        errors[field] = "Gender is required for policy targeting checks."
      } else if (field === "occupation" && issue.message.includes("Invalid option")) {
        errors[field] = "Occupation is required for sector-fit evaluation."
      } else if (field === "incomeRange" && issue.message.includes("Invalid option")) {
        errors[field] = "Income range is required for policy targeting checks."
      } else if (field === "category" && issue.message.includes("Invalid option")) {
        errors[field] = "Social category is required for targeted-scheme checks."
      } else {
        errors[field] = issue.message
      }
    }
    return errors
  }, [stepValidation])

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
    const parsed = profileSubmissionSchema.safeParse(formData)
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
  const stepLabels = ["Personal", "Location", "Occupation", "Goals"]
  const stepDescriptors = [
    "Identity & Demographics",
    "State & Residency Rules",
    "Targeting & Sector Fit",
    "Intent-Based Prioritization",
  ]

  const ageValue = Number.parseInt(formData.age, 10)
  const hasValidAgeNumber = Number.isFinite(ageValue)
  const ageSignal = (() => {
    if (!formData.age) return "Awaiting input"
    if (!hasValidAgeNumber || ageValue < 15 || ageValue > 100) return "Outside modeled range"
    if (ageValue <= 17) return "15-17 bucket"
    if (ageValue <= 40) return "18-40 bucket"
    if (ageValue <= 60) return "41-60 bucket"
    return "61-100 bucket"
  })()

  const incomeSignal = (() => {
    if (!formData.incomeRange) return "Awaiting input"
    if (formData.incomeRange === "lt1l") return "< Rs.1L"
    if (formData.incomeRange === "1to3l") return "Rs.1L - Rs.3L"
    if (formData.incomeRange === "3to5l") return "Rs.3L - Rs.5L"
    if (formData.incomeRange === "5to10l") return "Rs.5L - Rs.10L"
    return "Rs.10L+"
  })()

  const categorySignal = (() => {
    if (!formData.category) return "Awaiting input"
    if (["sc", "st", "obc"].includes(formData.category)) return "Applicable"
    return "General coverage"
  })()

  const hardDisqualifiers: string[] = []
  if (formData.age && (!hasValidAgeNumber || ageValue < 15 || ageValue > 100)) {
    hardDisqualifiers.push("Age outside modeled policy ranges (15-100)")
  }
  if (formData.gender && formData.gender !== "female" && formData.isPregnant) {
    hardDisqualifiers.push("Pregnancy flag conflicts with selected gender")
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
                  Identity & Demographics
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Base signals for demographic eligibility filters.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="age" className="font-semibold text-foreground">Age</Label>
                    <Input
                      id="age"
                      type="text"
                      inputMode="numeric"
                      placeholder="Your age"
                      value={formData.age}
                      onChange={(e) => updateField("age", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Modeled range: 15-100</p>
                    {showErrors && stepErrors.age && (
                      <p className="text-xs font-medium text-destructive">{stepErrors.age}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="gender" className="font-semibold text-foreground">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(v) => updateField("gender", v)}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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
                      I am currently pregnant
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
                  State & Residency Rules
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Regional constraints used by state-restricted schemes.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="state" className="font-semibold text-foreground">State</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(v) => updateField("state", v)}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {showErrors && stepErrors.state && (
                    <p className="text-xs font-medium text-destructive">{stepErrors.state}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="district" className="font-semibold text-foreground">District / City</Label>
                  <Input
                    id="district"
                    placeholder="Enter your district or city"
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
                    I live in a rural area (village / gram panchayat)
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
                  Targeting & Sector Fit
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Occupation, income, and category signals for policy targeting.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="occupation" className="font-semibold text-foreground">Occupation</Label>
                  <Select
                    value={formData.occupation}
                    onValueChange={(v) => updateField("occupation", v)}
                  >
                    <SelectTrigger id="occupation">
                      <SelectValue placeholder="Select your occupation" />
                    </SelectTrigger>
                    <SelectContent>
                      {OCCUPATIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {showErrors && stepErrors.occupation && (
                    <p className="text-xs font-medium text-destructive">{stepErrors.occupation}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="incomeRange" className="font-semibold text-foreground">Annual Household Income Range</Label>
                  <Select
                    value={formData.incomeRange}
                    onValueChange={(v) => updateField("incomeRange", v)}
                  >
                    <SelectTrigger id="incomeRange">
                      <SelectValue placeholder="Select income range" />
                    </SelectTrigger>
                    <SelectContent>
                      {INCOME_RANGES.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Choose the closest range if exact income is unknown.</p>
                  {showErrors && stepErrors.incomeRange && (
                    <p className="text-xs font-medium text-destructive">{stepErrors.incomeRange}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="category" className="font-semibold text-foreground">Social Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => updateField("category", v)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
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
                    Below Poverty Line (BPL) card holder
                  </Label>
                </div>

                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="isStreetVendor"
                    checked={formData.isStreetVendor}
                    onCheckedChange={(v) => updateField("isStreetVendor", !!v)}
                  />
                  <Label htmlFor="isStreetVendor" className="text-sm text-muted-foreground">
                    I am a street vendor (or have an official vendor certificate/LoR)
                  </Label>
                </div>

                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="isArtisan"
                    checked={formData.isArtisan}
                    onCheckedChange={(v) => updateField("isArtisan", !!v)}
                  />
                  <Label htmlFor="isArtisan" className="text-sm text-muted-foreground">
                    I am a traditional artisan/craftsperson (for PM Vishwakarma-type schemes)
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
                      I am the woman head of household (for Gruha Lakshmi-type schemes)
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
                  Intent-Based Prioritization
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select goals to improve ranking relevance.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {GOALS.map((goal) => {
                  const isSelected = formData.goals.includes(goal)
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
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
                      {goal}
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
              Back
            </Button>

            {step < totalSteps ? (
              <Button
                onClick={handleContinue}
                className="gap-2"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="gap-2"
              >
                Find My Schemes
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
              Eligibility Signals
            </h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="rounded-sm border border-border bg-muted/20 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Age Band</p>
              <p className="mt-1 font-medium text-foreground">{ageSignal}</p>
            </div>
            <div className="rounded-sm border border-border bg-muted/20 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Income Band</p>
              <p className="mt-1 font-medium text-foreground">{incomeSignal}</p>
            </div>
            <div className="rounded-sm border border-border bg-muted/20 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Category Targeting</p>
              <p className="mt-1 font-medium text-foreground">{categorySignal}</p>
            </div>
            <div className="rounded-sm border border-border bg-muted/20 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Hard Disqualifiers</p>
              <p className="mt-1 font-medium text-foreground">
                {hardDisqualifiers.length > 0 ? hardDisqualifiers[0] : "None detected"}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
