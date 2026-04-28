import { Utensils } from "lucide-react"

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="bg-primary p-2 rounded-full">
        <Utensils className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="font-bold text-xl">MealShare</span>
    </div>
  )
}

