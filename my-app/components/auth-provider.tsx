"use client"

import type React from "react"
import axios from "axios"
import { createContext, useState, useContext, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

type User = {
  email: string
  role: "student" | "staff" | "admin"
  name: string
  floor?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  adminLogin: (email: string, password: string) => Promise<void>  // Add this line
  staffLogin: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, floor: string) => Promise<void>
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log("Logging in with", email, password)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });
      if (response.data.user.role !== 'student') {
        throw new Error("Invalid role for this login page")
      }
      setUser(response.data.user)
      console.log(response.data);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
      throw error;
    }
  }

  const staffLogin = async (email: string, password: string) => {
    try {
      console.log("Staff logging in with", email, password)
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data.user.role !== 'staff') {
        throw new Error("Invalid role for staff login")
      }
      setUser(response.data.user)
      console.log(response.data);
    } catch (error) {
      toast({
        title: "Staff Login Failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
      throw error;
    }
  }

  const adminLogin = async (email: string, password: string) => {
    try {
      console.log("Admin logging in with", email, password)
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data.user.role !== 'admin') {
        throw new Error("Invalid role for admin login")
      }
      setUser(response.data.user)
      console.log(response.data);
    } catch (error) {
      toast({
        title: "Admin Login Failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
      throw error;
    }
  }

  const logout = () => {
    const role = user?.role
    setUser(null)
    localStorage.removeItem("user")
    
    // Redirect based on role
    if (role === 'admin') {
      window.location.href = '/admin-login'
    } else if (role === 'staff') {
      window.location.href = '/staff-login'
    } else {
      window.location.href = '/login'
    }
  }

  const signup = async (name: string, email: string, password: string, floor: string) => {
    console.log("Signup with", email, password)
    const response = await axios.post(`${API_URL}/auth/signup`, { name, email, password, floor });
    setUser(response.data.user)
    console.log(response.data);
  }

  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prevUser) => {
      if (prevUser) {
        const newUser = { ...prevUser, ...updatedUser }
        localStorage.setItem("user", JSON.stringify(newUser))
        return newUser
      }
      return prevUser
    })
  }
  
  return <AuthContext.Provider value={{ user, login, logout, signup, updateUser, staffLogin, adminLogin }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

