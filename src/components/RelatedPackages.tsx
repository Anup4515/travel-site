"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Users, IndianRupee, ArrowRight, Star } from "lucide-react";
import { IPackage } from "@/types";

interface RelatedPackagesProps {
  packages: IPackage[];
  currentPackageId: string;
}

export default function RelatedPackages({
  packages,
  currentPackageId,
}: RelatedPackagesProps) {
  const filtered = packages
    .filter((p) => (p._id || p.packageId) !== currentPackageId)
    .slice(0, 4);

  if (filtered.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">
        Similar Packages
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((pkg) => (
          <Link
            key={pkg._id || pkg.packageId}
            href={`/packages/${pkg.packageId || pkg._id}`}
            className="group block bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
              <Image
                src={pkg.image || "/images/tajmahal.jpg"}
                alt={pkg.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {pkg.featured && (
                <div className="absolute top-2 left-2 bg-blue-400 dark:bg-yellow-400 text-white dark:text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star size={10} />
                  Featured
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-black dark:text-white group-hover:text-blue-500 dark:group-hover:text-yellow-400 transition-colors mb-2 line-clamp-2">
                {pkg.name}
              </h3>

              {/* Details */}
              <div className="flex flex-col gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{pkg.duration}</span>
                </div>
                {pkg.cities && pkg.cities[0] && (
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span className="truncate">{pkg.cities[0]}</span>
                  </div>
                )}
              </div>

              {/* Price and Button */}
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-blue-500 dark:text-yellow-400 flex items-center">
                  <IndianRupee size={14} />
                  {(pkg.price ?? 0).toLocaleString()}
                </p>
                <ArrowRight
                  size={14}
                  className="text-blue-500 dark:text-yellow-400 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
