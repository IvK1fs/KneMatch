import { Hero } from '../components/Hero';
import { Categories } from '../components/Categories';
import TrendingSection from '../components/TrendingSection';
import { RecommendedRow } from '../components/RecommendedRow';

export function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <TrendingSection />
        <RecommendedRow />
      </div>
    </>
  );
}