import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-orange-100 to-background dark:from-orange-950 dark:to-background">
      <header className="container mx-auto py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8 lg:px-12 flex justify-between items-center">
        <div className="flex-shrink-0 scale-90 sm:scale-100">
          <Logo />
  
        </div>
        <div className="ml-2 sm:ml-4">
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="text-center space-y-6 sm:space-y-8 max-w-[90%] sm:max-w-2xl md:max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-orange-600 dark:text-orange-400 leading-tight">
            Welcome to MealShare
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join our college mess QR donation system and make a difference in your community. Share meals, reduce waste,
            and spread smiles!
          </p>
          <div className="flex flex-col gap-6 sm:gap-8 mt-8 sm:mt-10 md:mt-12">
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Button asChild size="lg" className="w-full sm:w-[180px] h-11 sm:h-12 text-base sm:text-lg">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-[180px] h-11 sm:h-12 text-base sm:text-lg">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Button asChild size="lg" className="w-full sm:w-[180px] h-11 sm:h-12 text-base sm:text-lg">
                <Link href="/staff-login">Staff Login</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="w-full sm:w-[180px] h-11 sm:h-12 text-base sm:text-lg">
                <Link href="/admin-login">Admin Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 md:px-8 text-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
        © 2025 MealShare. All rights reserved.
      </footer>
    </div>
  )
}

