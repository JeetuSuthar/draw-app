"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Loader2, LogIn, UserPlus, Mail, Lock, User } from "lucide-react"

interface AuthFormData {
  username: string
  password: string
  name?: string
}

export default function SignInPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true)
    try {
      const response = await axios.post("http://localhost:3001/signin", data)
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
      } else {
        throw new Error("Token missing in response")
      }
      
      toast.success("Welcome back!")
      router.replace("/rooms")

    } catch (error) {
      toast.error("Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex rounded-lg min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in</h1>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="username"
                {...register("username", { required: "Username is required" })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your username"
              />
            </div>
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="password"
                type="password"
                {...register("password", { required: "Password is required" })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your password"
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            New user?{" "}
            <button 
              onClick={() => router.push("/signup")}
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}