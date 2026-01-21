"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

function calculatePasswordStrength(password: string): { strength: number; label: string } {
  if (!password) return { strength: 0, label: "" }
  
  let strength = 0
  if (password.length >= 8) strength += 25
  if (password.length >= 12) strength += 15
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20
  if (/\d/.test(password)) strength += 15
  if (/[^a-zA-Z0-9]/.test(password)) strength += 25
  
  let label = ""
  if (strength < 30) label = "Weak"
  else if (strength < 60) label = "Fair"
  else if (strength < 80) label = "Good"
  else label = "Strong"
  
  return { strength: Math.min(strength, 100), label }
}

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [updatesAccepted, setUpdatesAccepted] = useState(false)
  
  const passwordStrength = calculatePasswordStrength(password)
  const passwordsMatch = !password || !confirmPassword || password === confirmPassword
  const isFormValid = termsAccepted && privacyAccepted && passwordsMatch && password && confirmPassword
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md glass-card-hover">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Create your account</CardTitle>
          <CardDescription className="text-base">
            Start tracking your expenses and take control of your finances.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullname" className="text-sm font-medium">
                Full name
              </label>
              <Input
                id="fullname"
                type="text"
                placeholder="John Doe"
                required
              />
            </div>
            
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
              />
            </div>
            
            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-secondary hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {password && (
                <div className="space-y-1">
                  <Progress value={passwordStrength.strength} />
                  <p className="text-xs text-foreground-secondary">
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>
            
            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-secondary hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-destructive">Passwords do not match</p>
              )}
            </div>
            
            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  required
                />
                <label htmlFor="terms" className="text-sm text-foreground-secondary cursor-pointer">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#6D5EF0] hover:underline">
                    Terms & Conditions
                  </Link>
                </label>
              </div>
              
              <div className="flex items-start gap-3">
                <Checkbox
                  id="privacy"
                  checked={privacyAccepted}
                  onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                  required
                />
                <label htmlFor="privacy" className="text-sm text-foreground-secondary cursor-pointer">
                  I agree to the{" "}
                  <Link href="/privacy" className="text-[#6D5EF0] hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              <div className="flex items-start gap-3">
                <Checkbox
                  id="updates"
                  checked={updatesAccepted}
                  onCheckedChange={(checked) => setUpdatesAccepted(checked === true)}
                />
                <label htmlFor="updates" className="text-sm text-foreground-secondary cursor-pointer">
                  Send me product updates and tips
                </label>
              </div>
            </div>
            
            {/* Submit Button */}
            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={!isFormValid}
            >
              Create account →
            </Button>
          </form>
          
          {/* Divider */}
          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-[#05060A] px-4 text-sm text-foreground-secondary">
                or continue with
              </span>
            </div>
          </div>
          
          {/* Social Signup */}
          <div className="space-y-3">
            <Button 
              type="button" 
              variant="outline" 
              size="lg" 
              className="w-full"
            >
              Sign up with Google
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="lg" 
              className="w-full opacity-50 cursor-not-allowed"
              disabled
            >
              Sign up with Apple (unavailable)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
