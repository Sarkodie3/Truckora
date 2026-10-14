import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getTruckManufacturers, getTruckModels } from '@/lib/services/products';
import { Truck, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'European Truck Manufacturers & Spares',
  description:
    'Genuine and tested replacement spares for DAF, Volvo Trucks, Scania, Mercedes-Benz, MAN, IVECO, and Renault commercial vehicles.',
};

export default async function ManufacturersPage() {
  const manufacturers = await getTruckManufacturers();
  const allModels = await getTruckModels();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mb-10">
        <div className="text-brand-orange font-bold text-xs uppercase tracking-wider mb-1">
          OEM Fleet Brands
        </div>
        <h1 className="text-3xl font-black text-brand-navy tracking-tight">
          Supported Truck Manufacturers
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          TRUCKORA supplies certified driveline components, braking, and body parts across all 7 premier European heavy commercial vehicle manufacturers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {manufacturers.map((brand) => {
          const brandModels = allModels.filter((m) => m.manufacturerId === brand.id);

          return (
            <div
              key={brand.id}
              className="bg-white rounded-xl border border-truckora-border p-6 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center overflow-hidden relative p-1.5">
                    {brand.logoUrl ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={brand.logoUrl}
                          alt={brand.name}
                          fill
                          sizes="56px"
                          className="object-contain p-0.5"
                        />
                      </div>
                    ) : (
                      <Truck className="w-6 h-6 text-brand-navy" />
                    )}
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">
                    {brand.country}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-brand-navy mb-2">{brand.name}</h2>
                <p className="text-xs text-slate-500 mb-4">
                  Full chassis fitment support, Euro 5 & Euro 6 engine assemblies, TraXon/I-Shift transmissions, and cab body panels.
                </p>

                <div className="mb-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Popular Models:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {brandModels.map((m) => (
                      <span
                        key={m.id}
                        className="text-[11px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                      >
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={`/manufacturers/${brand.slug}`}
                  className="w-full bg-slate-50 hover:bg-brand-navy hover:text-white text-brand-navy font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Explore {brand.name} Spares</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
