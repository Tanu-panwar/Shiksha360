import * as React from "react"
import { cn } from "@/lib/utils"

function Card({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-white text-gray-800 flex flex-col rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardAccent({ color = "from-blue-500 to-blue-300" }: { color?: string }) {
  return (
    <div className={`h-1 w-full bg-gradient-to-r ${color}`} />
  )
}

function CardHeader({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("px-6 pt-5 pb-2 flex flex-col gap-1", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-lg font-semibold leading-tight", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  )
}

function CardStat({ value, color }: { value: string; color?: string }) {
  return (
    <p className={cn("text-3xl font-bold", color ?? "text-blue-700")}>
      {value}
    </p>
  )
}

function CardTrend({ trend }: { trend: string }) {
  return (
    <p className="text-xs text-muted-foreground">{trend}</p>
  )
}

function CardContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 pb-5 space-y-1", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("px-6 py-4 border-t border-gray-100", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardAccent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardStat,
  CardTrend,
  CardContent,
  CardFooter,
}