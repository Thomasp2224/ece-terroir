import React from 'react';
import Hero from '@/components/home/Hero';
import UpcomingEventsPreview from '@/components/home/UpcomingEventsPreview';
import MissionSection from '@/components/home/MissionSection';
import MerchPreview from '@/components/home/MerchPreview';
import SocialFeedSection from '@/components/home/SocialFeedSection';
import BureauSection from '@/components/home/BureauSection';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <UpcomingEventsPreview />
      <MissionSection />
      <MerchPreview />
      <SocialFeedSection />
      <BureauSection />
    </div>
  );
}
