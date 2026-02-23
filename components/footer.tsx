import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              YojanaSaarthi AI
            </span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            A portfolio project focused on making government scheme discovery
            clearer, faster, and more actionable for citizens.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span>Public Benefit Discovery</span>
            <span aria-hidden="true">|</span>
            <span>Next.js + TypeScript</span>
            <span aria-hidden="true">|</span>
            <span>2026</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
