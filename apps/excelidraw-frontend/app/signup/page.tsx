"use client"
//Redploy
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { UserPlus, Mail, Lock, Eye, EyeOff, ArrowLeft, User, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AuthFormData {
  name: string
  email: string
  password: string
  acceptTerms: boolean
}

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const onSubmit = async (data: AuthFormData) => {
    

    setLoading(true)
    setAuthError(null)

    try {
      await axios.post(`https://draw-app-backend-bt3f.onrender.com/api/signup`, {
        name: data.name,
        username: data.email,
        password: data.password,
      })

      toast.success("Account created successfully!")
      router.push("/signin")
    } catch (error: any) {
      console.error("Sign up error:", error)

      if (error.response?.status === 409) {
        setAuthError("Email already in use")
      } else {
        setAuthError("An error occurred. Please try again.")
      }

      toast.error("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/"
                className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="text-sm">Back to home</span>
              </Link>

              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15 3.5C16.9587 3.5 18.3575 3.5 19.3888 3.88698C20.5585 4.33456 21.4937 5.15463 22.0284 6.22593C22.5 7.17771 22.5 8.42353 22.5 10.9152V15.5C22.5 17.9917 22.5 19.2375 22.0284 20.1893C21.4937 21.2606 20.5585 22.0806 19.3888 22.5282C18.3575 22.9152 16.9587 22.9152H15 22.9152H9C7.04128 22.9152 5.64253 22.9152 4.6112 22.5282C3.44151 22.0806 2.50628 21.2606 1.97161 20.1893C1.5 19.2375 1.5 17.9917 1.5 15.5V10.9152C1.5 8.42353 1.5 7.17771 1.97161 6.22593C2.50628 5.15463 3.44151 4.33456 4.6112 3.88698C5.64253 3.5 7.04128 3.5 9 3.5H15Z"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <path d="M12 8L17 15H7L12 8Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create an account</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Sign up to start collaborating</p>
            </div>

            {authError && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    {...register("name", {
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    className="pl-10"
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                </div>
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="pl-10"
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    className="pl-10 pr-10"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 pt-1">
                  <Check className="h-3 w-3 mr-1" />
                  <span>Must be at least 8 characters</span>
                </div>
              </div>

              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {loading ? (
                  <>
                    <span className="animate-pulse">Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create account
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Sign in
              </Link>
            </div>
            <div className="text-center  text-sm text-gray-600 dark:text-gray-400">
          
            <span className="text-purple-500">Username</span>:ok@gmail.com
          </div>
          <div className="text-center  text-sm text-gray-600 dark:text-gray-400">
           <span className="text-purple-500">Password</span>:ok@gmail.com
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}