import { SiteHeader } from "@/components/site-header"
import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <SignupForm />
    </div>
  )
}
