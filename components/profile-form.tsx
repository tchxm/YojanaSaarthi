"use client"

import { useState } from "react"
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
import { ArrowRight, ArrowLeft, User, MapPin, Briefcase, Target } from "lucide-react"

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
  const totalSteps = 4

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    state: "",
    district: "",
    occupation: "",
    annualIncome: "",
    category: "",
    isRural: false,
    isBPL: false,
    isPregnant: false,
    isStreetVendor: false,
    goals: [] as string[],
  })

  const updateField = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }))
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.age && formData.gender
      case 2:
        return formData.state && formData.district
      case 3:
        return formData.occupation && formData.annualIncome && formData.category
      case 4:
        return formData.goals.length > 0
      default:
        return false
    }
  }

  const handleSubmit = () => {
    const params = new URLSearchParams({
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      state: formData.state,
      district: formData.district,
      occupation: formData.occupation,
      annualIncome: formData.annualIncome,
      category: formData.category,
      isRural: formData.isRural.toString(),
      isBPL: formData.isBPL.toString(),
      isPregnant: formData.isPregnant.toString(),
      isStreetVendor: formData.isStreetVendor.toString(),
      goals: formData.goals.join(","),
    })
    router.push(`/results?${params.toString()}`)
  }

  const stepIcons = [User, MapPin, Briefcase, Target]
  const stepLabels = ["Personal", "Location", "Occupation", "Goals"]

  return (
    <div className="mx-auto w-full max-w-2xl" suppressHydrationWarning>
      {/* Progress */}
      <div className="mb-10 flex items-center justify-between">
        {stepLabels.map((label, i) => {
          const Icon = stepIcons[i]
          const isActive = step === i + 1
          const isDone = step > i + 1
          return (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
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
                  className={`text-xs font-medium ${
                    isActive ? "text-primary" : isDone ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div
                  className={`mx-2 hidden h-0.5 flex-1 rounded-full sm:block ${
                    isDone ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step 1: Personal */}
      {step === 1 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Tell us about yourself
            </h2>
            <p className="mt-1 text-muted-foreground">
              Basic information to help match you with the right schemes.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Your age"
                  min={1}
                  max={120}
                  value={formData.age}
                  onChange={(e) => updateField("age", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="gender">Gender</Label>
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
              </div>
            </div>

            {formData.gender === "female" && (
              <div className="flex items-center gap-3">
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

      {/* Step 2: Location */}
      {step === 2 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Where do you live?
            </h2>
            <p className="mt-1 text-muted-foreground">
              State-specific schemes may be available for your region.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="state">State</Label>
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
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="district">District / City</Label>
              <Input
                id="district"
                placeholder="Enter your district or city"
                value={formData.district}
                onChange={(e) => updateField("district", e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
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

      {/* Step 3: Occupation & Income */}
      {step === 3 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Occupation & Income
            </h2>
            <p className="mt-1 text-muted-foreground">
              Many schemes are targeted at specific occupations and income levels.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="occupation">Occupation</Label>
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
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="annualIncome">Annual Household Income (Rs.)</Label>
              <Input
                id="annualIncome"
                type="number"
                placeholder="e.g. 150000"
                min={0}
                value={formData.annualIncome}
                onChange={(e) => updateField("annualIncome", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Social Category</Label>
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
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="isBPL"
                checked={formData.isBPL}
                onCheckedChange={(v) => updateField("isBPL", !!v)}
              />
              <Label htmlFor="isBPL" className="text-sm text-muted-foreground">
                Below Poverty Line (BPL) card holder
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="isStreetVendor"
                checked={formData.isStreetVendor}
                onCheckedChange={(v) => updateField("isStreetVendor", !!v)}
              />
              <Label htmlFor="isStreetVendor" className="text-sm text-muted-foreground">
                I am a street vendor (or have an official vendor certificate/LoR)
              </Label>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Goals */}
      {step === 4 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What are your goals?
            </h2>
            <p className="mt-1 text-muted-foreground">
              Select what kind of support you are looking for. Pick as many as apply.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {GOALS.map((goal) => {
              const isSelected = formData.goals.includes(goal)
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left text-sm font-medium transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
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
        </div>
      )}

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 1}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {step < totalSteps ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="gap-2"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed()}
            className="gap-2"
          >
            Find My Schemes
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
