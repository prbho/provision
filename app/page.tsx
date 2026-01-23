import CoreServices from '@/components/CoreServices'
import CTABannerSimple from '@/components/CTABannerSimple'
import FeaturedPropertiesCarousel from '@/components/FeaturedPropertiesCarousel'
import Hero from '@/components/Hero/Hero'
import HeroSearchSection from '@/components/Hero/HeroSearchSection'
import FinalCTA from '@/components/home/FinalCTA'
import ServicesSection from '@/components/ServicesSection'
import TestimonialsSection from '@/components/Testimonialssection'

export default function Home() {
  return (
    <>
      <main className="min-h-screen ">
        {/* Hero Section with Search */}
        <div className="relative z-0">
          <Hero />
        </div>
        <div className="relative z-0">
          <HeroSearchSection />
        </div>

        <div className="relative z-0">
          <ServicesSection />
        </div>
        <div className="relative z-0">
          <CTABannerSimple />
        </div>
        <div className="relative z-0">
          <FeaturedPropertiesCarousel />
        </div>
        <div className="relative z-0">
          <CoreServices />
        </div>
        <div className="relative z-0">
          <TestimonialsSection />
        </div>

        <div className="relative z-0">
          {/* Trust and Credibility Section */}
          {/* Assuming TrustCredibilitySection is imported */}
          {/* <TrustCredibilitySection /> */}
          <FinalCTA />
        </div>
      </main>
    </>
  )
}
