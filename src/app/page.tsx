import React from 'react';
import Hero from '@/components/home/Hero';
import BrowseByBrand from '@/components/home/BrowseByBrand';
import BrowseByCategory from '@/components/home/BrowseByCategory';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyChooseTruckora from '@/components/home/WhyChooseTruckora';
import CustomerSupportSection from '@/components/home/CustomerSupportSection';
import { getFeaturedProducts } from '@/lib/services/products';

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(8);

  return (
    <div className="flex flex-col">
      {/* Hero & Multi-facet Parts Search */}
      <Hero />

      {/* Browse by Truck Brand */}
      <BrowseByBrand />

      {/* Featured Products Showcase */}
      <FeaturedProducts products={featuredProducts} />

      {/* Shop by Category */}
      <BrowseByCategory />

      {/* Why Fleets Choose TRUCKORA */}
      <WhyChooseTruckora />

      {/* Customer Technical Support & VIN Enquiry */}
      <CustomerSupportSection />
    </div>
  );
}
