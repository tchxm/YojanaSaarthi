"use client"

import { useEffect, useState } from "react"

export function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const getColor = () => {
    if (score >= 85) return "text-success stroke-success"
    if (score >= 70) return "text-primary stroke-primary"
    if (score >= 50) return "text-warning stroke-warning"
    return "text-destructive stroke-destructive"
  }

  const getLabel = () => {
    if (score >= 85) return "Highly Eligible"
    if (score >= 70) return "Eligible"
    if (score >= 50) return "Likely Eligible"
    return "Partial Match"
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-border"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${getColor()}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${getColor().split(" ")[0]}`}>
            {animatedScore}%
          </span>
        </div>
      </div>
      <span className={`text-xs font-medium ${getColor().split(" ")[0]}`}>
        {getLabel()}
      </span>
    </div>
  )
}
