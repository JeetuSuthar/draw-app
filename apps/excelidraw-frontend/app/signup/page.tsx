"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { motion } from "framer-motion"
import { Loader2, UserPlus, Mail, Lock, Eye, EyeOff, ArrowLeft, User, Github, Twitter, Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AuthFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuthFormData>()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const password = watch("password", "")
  const passwordStrength = calculatePasswordStrength(password)

  function calculatePasswordStrength(password: string): number {
    if (!password) return 0

    let strength = 0

    // Length check
    if (password.length >= 8) strength += 25

    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25

    return strength
  }

  function getPasswordStrengthLabel(strength: number): string {
    if (strength === 0) return "No password"
    if (strength <= 25) return "Weak"
    if (strength <= 50) return "Fair"
    if (strength <= 75) return "Good"
    return "Strong"
  }

  function getPasswordStrengthColor(strength: number): string {
    if (strength === 0) return "bg-gray-200 dark:bg-gray-700"
    if (strength <= 25) return "bg-red-500"
    if (strength <= 50) return "bg-yellow-500"
    if (strength <= 75) return "bg-blue-500"
    return "bg-green-500"
  }

  const onSubmit = async (data: AuthFormData) => {
    if (data.password !== data.confirmPassword) {
      setAuthError("Passwords do not match")
      return
    }

    if (!data.acceptTerms) {
      setAuthError("You must accept the terms and conditions")
      return
    }

    setLoading(true)
    setAuthError(null)

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_HTTP_BACKEND_URL}/signup`, {
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
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
                    d="M15 3.5C16.9587 3.5 18.3575 3.5 19.3888 3.88698C20.5585 4.33456 21.4937 5.15463 22.0284 6.22593C22.5 7.17771 22.5 8.42353 22.5 10.9152V15.5C22.5 17.9917 22.5 19.2375 22.0284 20.1893C21.4937 21.2606 20.5585 22.0806 19.3888 22.5282C18.3575 22.9152 16.9587 22.9152 15 22.9152H9C7.04128 22.9152 5.64253 22.9152 4.6112 22.5282C3.44151 22.0806 2.50628 21.2606 1.97161 20.1893C1.5 19.2375 1.5 17.9917 1.5 15.5V10.9152C1.5 8.42353 1.5 7.17771 1.97161 6.22593C2.50628 5.15463 3.44151 4.33456 4.6112 3.88698C5.64253 3.5 7.04128 3.5 9 3.5H15Z"
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

                {/* Password strength meter */}
                {password && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Password strength: {getPasswordStrengthLabel(passwordStrength)}
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Use 8+ characters with a mix of letters, numbers & symbols</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Progress value={passwordStrength} className={getPasswordStrengthColor(passwordStrength)} />

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="flex items-center text-xs">
                        <div
                          className={`h-3 w-3 rounded-full mr-1 ${password.length >= 8 ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                        >
                          {password.length >= 8 && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className={password.length >= 8 ? "text-green-500" : "text-gray-500"}>8+ characters</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <div
                          className={`h-3 w-3 rounded-full mr-1 ${/[A-Z]/.test(password) ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                        >
                          {/[A-Z]/.test(password) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className={/[A-Z]/.test(password) ? "text-green-500" : "text-gray-500"}>Uppercase</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <div
                          className={`h-3 w-3 rounded-full mr-1 ${/[0-9]/.test(password) ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                        >
                          {/[0-9]/.test(password) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className={/[0-9]/.test(password) ? "text-green-500" : "text-gray-500"}>Number</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <div
                          className={`h-3 w-3 rounded-full mr-1 ${/[^A-Za-z0-9]/.test(password) ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                        >
                          {/[^A-Za-z0-9]/.test(password) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className={/[^A-Za-z0-9]/.test(password) ? "text-green-500" : "text-gray-500"}>
                          Symbol
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === password || "Passwords do not match",
                    })}
                    className="pl-10 pr-10"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              <div className="flex items-start">
                <Checkbox id="acceptTerms" {...register("acceptTerms")} className="mt-1" />
                <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
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
          </div>
        </div>
      </motion.div>
    </div>
  )
}
