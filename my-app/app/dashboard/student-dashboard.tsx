"use client"

import { useAuth } from "@/components/auth-provider"

export default function StudentDashboard() {
  const { user } = useAuth()
  return (
    <div>
      <h1>Welcome, {user?.name || user?.email}!</h1>
      <p>This is your student dashboard.</p>
    </div>
  )
}

