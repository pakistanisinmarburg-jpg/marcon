import HeroSection from '../components/home/HeroSection';
import QuickActions from '../components/home/QuickActions';
import WeeklyEvents from '../components/home/WeeklyEvents';
import CommunitiesSection from '../components/home/CommunitiesSection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <QuickActions />
      <WeeklyEvents />
      <CommunitiesSection />
    </div>
  );
}