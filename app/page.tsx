import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { CtaBanner } from "@/components/cta-banner"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#05060A]">
      <SiteHeader />
      <main className="relative z-10">
        <Hero />
        <CtaBanner />
      </main>
      <SiteFooter />
    </div>
  )
}
