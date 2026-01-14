'use client';

import { MouseTrail } from '@/components/mouse-trail';
import { Navigation } from '@/components/navigation';
import { DynamicHero } from '@/components/sections/dynamic-hero';
import { AboutSection } from '@/components/sections/about-section';
import { CategoriesSection } from '@/components/sections/categories-section';
import { ExperienceSection } from '@/components/sections/experience-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { Footer } from '@/components/footer';
import { FloatingVideoCard } from '@/components/floating-video-card';
import { AIChatWidget } from '@/components/ai-chat-widget';

export default function HomePage() {
  return (
    <>
      <MouseTrail />
      <main className="relative bg-white min-h-screen">
        <Navigation />
        <DynamicHero />
        <AboutSection />
        <CategoriesSection />
        <ExperienceSection />
        <TestimonialsSection />
        <Footer />
        <FloatingVideoCard />
        <AIChatWidget />
      </main>
    </>
  );
}
